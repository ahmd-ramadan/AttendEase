import React, { useRef } from 'react';
import CloseIcon from './Icons/Close';

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
                    <CloseIcon size={30} onClick={closeModal} />
                </div>
                <div className="overflow-y-auto scrollbar max-h-96 lg:max-h-[500px] p-2 mt-4 text-gray">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;