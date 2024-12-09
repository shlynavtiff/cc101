import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { FiLinkedin } from "react-icons/fi";
import { FiGithub } from "react-icons/fi";
import { FaUpwork } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='flex flex-row justify-between items-center text-center p-2 pb-4 text-xs px-8 ' >
                <div className='flex items-center'>
                <p>© 2024 <u> <a href="https://socials-lake.vercel.app/" target='_blank'>shlynavtiff.</a></u></p>
                </div>
                <div className='flex gap-4 items-center'>
                    <a href="https://www.instagram.com/shlynav.tiff/" target='_blank'><FaInstagram size={18} /></a>
                    <a href="https://www.upwork.com/freelancers/~01f62a6911a8983937" target='_blank'><FaUpwork size={18} /></a>
                    <a href="https://github.com/shlynavtiff" target='_blank'><FiGithub size={18} /></a>
                </div>
        </footer>
  )
}

export default Footer