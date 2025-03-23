import React, { useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    title?: string;
    bgColor?: string;
    titleColor?: string;
    closeColor?: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, closeModal, title, children, bgColor="#fff", titleColor="var(--color-primary)", closeColor="#030712"}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return (
        <div className={`mx-auto fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50`}>
            <div
                ref={modalRef}
                className={`p-6 rounded-lg shadow-2xl w-[90%] md:w-[60%] relative`}
                style={{ backgroundColor: bgColor }}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-between items-center">
                    <h2 
                        className="text-xl font-semibold"
                        style={{ color: titleColor }}
                    >
                        {title}
                    </h2>
                    <svg onClick={closeModal} width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
                </div>
                <div className="overflow-y-auto scrollbar max-h-96 lg:max-h-[500px] p-2 mt-4 text-gray">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;