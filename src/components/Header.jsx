import React from "react";
import MenuIcon from "./MenuIcon";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Header({ isNavOpen, setIsNavOpen }) {
 const toggleNav = () => {
 setIsNavOpen(!isNavOpen);
 };

 useGSAP(() => {

 const tl = gsap.timeline({ paused: true });
 tl.from(".navbar", {
 opacity: 0,
 y: -50,
 duration: 0.5,
 }).from(".nav-item", {
 opacity: 0,
 y: -50,
 duration: 0.5,
 stagger: 0.2
 });
 tl.play();
 }, []);

 return (
 <div className="navbar bg-base-100 shadow-sm px-5 fixed top-0 left-0 right-0 z-50">
 <div className="navbar-start flex items-center justify-start gap-4 ">
 <div
 role="button"
 className="nav-item btn btn-ghost btn-circle ml-[-10px]"
 onClick={toggleNav}
 >
 <MenuIcon isOpen={isNavOpen} />
 </div>
 <div className={`nav-item bg-transparent`}>
 <img
 src="/logo_outlined.webp"
 alt=""
 className={`w-12 h-12 object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]`}
 />
 </div>
 </div>
 <div className="navbar-center">
 <a className="btn btn-ghost text-xl">
 Tiny Steps Child Development Center
 </a>
 </div>
 <div className="navbar-end">
 <button className="btn btn-ghost btn-circle nav-item">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </button>
 <button className="btn btn-ghost btn-circle nav-item">
 <div className="indicator">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
 </svg>
 <span className="badge badge-xs badge-primary indicator-item"></span>
 </div>
 </button>
 </div>
 </div>
 );
}
