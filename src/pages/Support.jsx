import React from 'react'
import Footer from '../comp/wasd/Footer'
import Navbar from '../comp/wasd/Navbar';
const Support = () => {

    const handleContactSupport = () => {
        const emailAddress = 'your_support_email@example.com'; // Replace with your actual support email
        const subject = 'Support Request'; // You can customize the subject
        const body = 'Dear Support Team,\n\nI am writing to request assistance with my account. \n\nSincerely,\n[User Name]'; // Customize the body

        const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank'); 
        
    };

    return (
        <div className='h-screen w-full p-2 flex flex-col justify-between'>
            <Navbar />
            <div className='flex items-center justify-center'>
                <div >
                <h1>Contact Support</h1> 
                    <p className="mt-4">
                        If you have any questions, issues, or feedback regarding our app, please don't hesitate to contact our support team.
                    </p>
                    <p className="mt-2">
                        You can reach us by clicking the button below, which will open your email client with a pre-filled message.
                    </p>
                    <button
                        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleContactSupport}
                    >
                        Contact Support
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Support