import React from "react";
import CreateAccountModal from "../comp/CreateAccountModal";
import Header from "../comp/Header";
import Footer from "../comp/wasd/Footer";

const CreateAccount = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header inputSee={false} bookSee={false} locString={"Register"} />
      <div className="flex-grow flex items-center justify-center p-3 min-h-[600px]">
        <div className="w-full max-w-[400px]">
          <CreateAccountModal />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateAccount;
