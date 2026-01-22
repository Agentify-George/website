"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { LoginModal } from '@/components/ui/LoginModal';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    return (
        <>
            <nav className="fixed z-50 transition-all duration-300 reveal active bg-[#030304]/80 w-full border-white/5 border-b top-0 backdrop-blur-md">
                <div className="flex h-16 max-w-7xl mr-auto ml-auto pr-6 pl-6 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/76a0dad8-5826-4116-a2d1-d89514661099_320w.png"
                            alt="Agentify Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="group-hover:opacity-80 transition-opacity text-base font-semibold text-white tracking-tight font-montserrat">
                            Agentify
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="/case-studies" className="transition-colors hover:text-white font-manrope">
                            Case Studies
                        </Link>
                        <Link href="/how-it-works" className="transition-colors hover:text-white font-manrope">
                            How it Works
                        </Link>
                        <Link href="/pricing" className="transition-colors hover:text-white font-manrope">
                            Pricing
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="hidden sm:block text-xs font-medium transition-colors hover:text-white font-manrope"
                        >
                            Sign in
                        </button>

                        <a
                            href="https://cal.com/weareagentify/agentify-calender-meetings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-300 hover:bg-white/20 text-xs font-medium text-white font-manrope bg-purple-700 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur-sm"
                        >
                            Book a Call
                        </a>

                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-[#030304] z-40 flex flex-col pt-24 px-6 space-y-6 h-screen overflow-y-auto">
                    <Link href="/case-studies" onClick={toggleMenu} className="text-xl font-medium text-white font-manrope border-b border-white/10 pb-4 block">
                        Case Studies
                    </Link>
                    <Link href="/how-it-works" onClick={toggleMenu} className="text-xl font-medium text-white font-manrope border-b border-white/10 pb-4 block">
                        How it Works
                    </Link>
                    <Link href="/pricing" onClick={toggleMenu} className="text-xl font-medium text-white font-manrope border-b border-white/10 pb-4 block">
                        Pricing
                    </Link>
                    <div className="pt-4 flex flex-col gap-4">
                        <button onClick={() => { setIsLoginModalOpen(true); toggleMenu(); }} className="text-center w-full py-3 rounded-lg border border-white/10 text-white font-manrope">
                            Sign in
                        </button>
                        <a href="https://cal.com/weareagentify/agentify-calender-meetings" target="_blank" className="text-center w-full py-3 rounded-lg bg-purple-700 text-white font-manrope">
                            Book a Call
                        </a>
                    </div>
                </div>
            )}

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}
