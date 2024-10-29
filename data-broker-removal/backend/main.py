from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Move DATA_BROKERS outside the class
DATA_BROKERS = [
    {"name": "Spokeo", "email": "privacy@spokeo.com"},
    {"name": "WhitePages", "email": "privacy@whitepages.com"},
    {"name": "BeenVerified", "email": "privacy@beenverified.com"},
    {"name": "PeopleFinders", "email": "optout@peoplefinders.com"},
    {"name": "Intelius", "email": "privacy@intelius.com"}
]

class RemovalRequest(BaseModel):
    full_name: str
    email: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

@app.post("/send-removal-requests")
async def send_removal_requests(request: RemovalRequest):
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        
        # Template for each broker
        def get_email_body(broker_name):
            return f"""
            Dear {broker_name},

            I am writing to request the removal of my personal information from your database. 
            Under Section 1798.105 of CCPA, Articles 7(3), 17 and 21 of GDPR and other applicable privacy legislation, 
            I have the right to the erasure of personal data without undue delay, and the withdraw any consent given to the processing of personal data (information);

            My information:
            Name: {request.full_name}
            Address: {request.address}
            City: {request.city}
            State: {request.state}
            Zip Code: {request.zip_code}

            Please remove all records associated with my information from your database within 45 days without any undue delay
            and confirm once this has been completed. 

            Thank you for your prompt attention to this matter.

            Best regards,
            {request.full_name}
            """

        successful_sends = []
        failed_sends = []

        # Send to each data broker
        for broker in DATA_BROKERS:
            try:
                message = Mail(
                    from_email=os.getenv('SENDGRID_FROM_EMAIL'),
                    to_emails=broker['email'],
                    subject='Personal Information Removal Request',
                    plain_text_content=get_email_body(broker['name'])
                )
                
                # CC the user
                message.cc = [request.email]
                
                # Send email
                response = sg.send(message)
                
                if response.status_code == 202:
                    successful_sends.append(broker['name'])
                else:
                    failed_sends.append(broker['name'])
                    
            except Exception as e:
                failed_sends.append(broker['name'])
                print(f"Error sending to {broker['name']}: {str(e)}")

        return {
            "success": True,
            "message": f"Successfully sent to {len(successful_sends)} brokers",
            "successful_sends": successful_sends,
            "failed_sends": failed_sends
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)