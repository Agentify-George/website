"use client";

import { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    {/* Modal Panel */}
                    <div className={`relative transform overflow-hidden rounded-3xl bg-purple-900/10 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-900/20 text-left transition-all duration-300 sm:my-8 sm:w-full sm:max-w-md p-8 ${isOpen ? 'scale-100' : 'scale-95'}`}>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 text-purple-400">
                                <User size={24} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white font-montserrat" id="modal-title">Welcome Back</h3>
                            <p className="mt-2 text-sm text-slate-400 font-manrope">Sign in to your Agentify account</p>
                        </div>

                        <form action="#" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 font-manrope mb-2">Email address</label>
                                <input type="email" name="email" id="email" autoComplete="email" required
                                    className="block w-full rounded-lg border-0 bg-white/5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 text-base px-4 font-manrope" />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 font-manrope mb-2">Password</label>
                                <input type="password" name="password" id="password" autoComplete="current-password" required
                                    className="block w-full rounded-lg border-0 bg-white/5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 text-base px-4 font-manrope" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox"
                                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 font-manrope">Remember me</label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-purple-400 hover:text-purple-300 font-manrope">Forgot password?</a>
                                </div>
                            </div>

                            <div>
                                <button type="submit"
                                    className="flex w-full justify-center rounded-full bg-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 font-manrope transition-all duration-300">
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-400 font-manrope">
                            Not a member?
                            <a href="#" className="font-semibold text-purple-400 hover:text-purple-300">Start a free trial</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
