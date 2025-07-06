import React from 'react';
import facebook from '../../assets/facebook.svg';
import Twitter from '../../assets/twitter.svg';
import LinkedIn from '../../assets/linkedin.svg';

const Footer = () => {
    return (
        <>
            <footer className="text-sm sm:text-base p-4 border-t-2 border-gray-400  text-center mt-10">
                <div className="container mx-auto">
                    <p>
                        © {new Date().getFullYear()} Cric11 - All Rights
                        Reserved
                    </p>
                    <div className="flex justify-center space-x-4 mt-3">
                        <a
                            href="/terms"
                            className="hover:underline"
                        >
                            Terms
                        </a>
                        <a
                            href="/privacy"
                            className="hover:underline"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/contact"
                            className="hover:underline"
                        >
                            Contact Us
                        </a>
                    </div>
                    <div className="flex space-x-4 md:mb-0 justify-center mt-4">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <img
                                src={facebook}
                                alt="Facebook"
                                className="w-8 h-8"
                            />
                        </a>
                        <a href="https://www.twitter/" target="_blank" rel="noopener noreferrer">
                            <img
                                src={Twitter}
                                alt="Twitter"
                                className="w-8 h-8"
                            />
                        </a>
                        <a href="https://www.linkedin.com/in/ankit305/" target="_blank" rel="noopener noreferrer">
                            <img
                                src={LinkedIn}
                                alt="LinkedIn"
                                className="w-8 h-8"
                            />
                        </a>
                    </div>
                </div>
            </footer >
        </>
    );
};

export default Footer;
