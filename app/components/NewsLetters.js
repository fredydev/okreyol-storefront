import { useState } from 'react';
import {Form} from '@remix-run/react';
import {FaTelegramPlane} from 'react-icons/fa'



const EmptyCollection = ({heading}) => {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
  
    const handleEmailChange = (event) => {
      const inputEmail = event.target.value;
      setEmail(inputEmail);
      setIsValidEmail(validateEmail(inputEmail));
    };  
  
    const validateEmail = (email) => {
      // Logique de validation de l'email
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-3xl font-bold mb-4">{heading}</h2>
      <p className="text-lg text-gray-600 mb-8">Pas de spam, promis !</p>
      <Form
              method="post"
              noValidate
              className="flex mb-2"
            >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  className={`border border-gray-300 rounded-l-sm py-2 px-4 w-full text-black ${
                    isValidEmail ? "pr-12" : ""
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                />
              
              <button
                className={`${
                  isValidEmail ? "bg-corange" : "bg-gray-300"
                } text-white rounded-r-sm px-4 transition-colors duration-300`}
                disabled={!isValidEmail}
              >
                <FaTelegramPlane />
              </button>
            </Form>
    </div>
  );
};

export default EmptyCollection;
