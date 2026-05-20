from fastapi import FastAPI, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime
import traceback
import os
import io

from youtube import get_full_company_data
from gemini import analyse_companies
from pptx_builder import build_pptx

# Initialize FastAPI app
app = FastAPI(title="Video Competitor Intelligence", version="1.0.0")

# CORS configuration - allow specific origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# Add custom frontend URL from environment if provided
if frontend_url := os.getenv("FRONTEND_URL", "").strip():
    ALLOWED_ORIGINS.append(frontend_url)

# For production: allow Vercel domains using wildcard
# Note: CORS middleware with allow_origins=["*"] already handles all domains
# For stricter security on production, replace with specific Vercel domain when known
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS + ["*"],  # "*" for dev; replace with specific domain in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models for validation
class AnalysisRequest(BaseModel):
    company: str
    competitors: List[str]
    
    @field_validator('company')
    @classmethod
    def validate_company(cls, v):
        if not v or not isinstance(v, str) or len(v.strip()) == 0:
            raise ValueError("Company name is required and must be non-empty")
        return v.strip()
    
    @field_validator('competitors')
    @classmethod
    def validate_competitors(cls, v):
        if not isinstance(v, list):
            raise ValueError("Competitors must be a list")
        if len(v) < 1 or len(v) > 4:
            raise ValueError("You must specify between 1 and 4 competitors")
        # Validate each competitor
        for competitor in v:
            if not isinstance(competitor, str) or len(competitor.strip()) == 0:
                raise ValueError("Each competitor name must be a non-empty string")
        return [c.strip() for c in v]


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/analyse")
async def analyse(request: AnalysisRequest):
    """
    Analyze a company and its competitors.
    Returns analysis results and company data without generating a report.
    Gracefully handles missing YouTube channels.
    
    Request body:
    {
        "company": "Nike",
        "competitors": ["Adidas", "Puma"]
    }
    """
    try:
        # Compile all companies to analyze (main company + competitors)
        all_companies = [request.company] + request.competitors
        
        print(f"Starting analysis for: {', '.join(all_companies)}")
        
        # Fetch YouTube data for each company
        company_data = []
        failed_companies = []
        
        for company in all_companies:
            try:
                print(f"Fetching YouTube data for: {company}")
                data = get_full_company_data(company)
                
                if "error" in data:
                    # Store error info but don't fail - will note in report
                    error_msg = data.get('error', 'No channel found')
                    failed_companies.append({
                        "company": company,
                        "reason": error_msg
                    })
                    print(f"Skipped {company}: {error_msg}")
                else:
                    company_data.append(data)
                    print(f"Successfully fetched data for {company}")
                    
            except Exception as e:
                error_msg = str(e)
                failed_companies.append({
                    "company": company,
                    "reason": error_msg
                })
                print(f"Exception fetching data for {company}: {error_msg}")
                traceback.print_exc()
        
        # Check if we have at least data for the main company
        if not any(c.get("company_name") == request.company for c in company_data):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Could not find YouTube channel for main company '{request.company}'. Please verify the company name is correct."
            )
        
        # If we have fewer than 2 companies, warn but continue
        if len(company_data) < 2 and request.competitors:
            print(f"Warning: Only found {len(company_data)} out of {len(all_companies)} companies")
        
        # Perform AI analysis
        print("Sending data to Gemini for analysis...")
        analysis = analyse_companies(company_data)
        
        if "error" in analysis:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI analysis failed: {analysis.get('details', 'Unknown error')}"
            )
        
        print("Analysis complete")
        
        # Return results with notes about failed companies
        response = {
            "success": True,
            "analysis": analysis,
            "company_data": company_data,
            "timestamp": datetime.now().isoformat()
        }
        
        # Only include failed_companies if there were failures
        if failed_companies:
            response["failed_companies"] = failed_companies
            response["note"] = f"Could not find YouTube channels for {len(failed_companies)} company/companies"
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in /analyse endpoint: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@app.post("/generate-report")
async def generate_report(request: AnalysisRequest):
    """
    Analyze companies and generate a downloadable PowerPoint report.
    Gracefully handles missing YouTube channels by including only found companies.
    
    Request body:
    {
        "company": "Nike",
        "competitors": ["Adidas", "Puma"]
    }
    
    Returns: .pptx file as download
    """
    try:
        # Compile all companies to analyze
        all_companies = [request.company] + request.competitors
        
        print(f"Starting report generation for: {', '.join(all_companies)}")
        
        # Fetch YouTube data for each company
        company_data = []
        failed_companies = []
        
        for company in all_companies:
            try:
                print(f"Fetching YouTube data for: {company}")
                data = get_full_company_data(company)
                
                if "error" in data:
                    error_msg = data.get('error', 'No channel found')
                    failed_companies.append({
                        "company": company,
                        "reason": error_msg
                    })
                    print(f"Skipped {company}: {error_msg}")
                else:
                    company_data.append(data)
                    print(f"Successfully fetched data for {company}")
                    
            except Exception as e:
                error_msg = str(e)
                failed_companies.append({
                    "company": company,
                    "reason": error_msg
                })
                print(f"Exception fetching data for {company}: {error_msg}")
                traceback.print_exc()
        
        # Check if we have at least data for the main company
        if not any(c.get("company_name") == request.company for c in company_data):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Could not find YouTube channel for main company '{request.company}'. Please verify the company name is correct."
            )
        
        # Perform AI analysis
        print("Sending data to Gemini for analysis...")
        analysis = analyse_companies(company_data)
        
        if "error" in analysis:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI analysis failed: {analysis.get('details', 'Unknown error')}"
            )
        
        print("Analysis complete, generating PowerPoint...")
        
        # Build PowerPoint file
        pptx_bytes = build_pptx(company_data, analysis, failed_companies)
        
        print("PowerPoint generated successfully")
        
        # Generate filename with date
        date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"competitor-report-{request.company.replace(' ', '-').lower()}-{date_str}.pptx"
        
        # Return file as response
        return StreamingResponse(
        io.BytesIO(pptx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in /generate-report endpoint: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"Unhandled exception: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "An unexpected error occurred",
            "details": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
