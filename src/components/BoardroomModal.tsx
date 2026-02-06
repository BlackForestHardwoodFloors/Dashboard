import React, { ReactNode, useEffect } from "react";

type Props = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * BoardroomModal
 * Reusable near-fullscreen modal shell with:
 * - Responsive sizing (desktop 65vw → laptop 75vw → tablet 95vw)
 * - Slide-in animation
 * - Boardroom theme (dark + gold)
 */
export default function BoardroomModal({ isOpen, title, onClose, children }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="br-modal-overlay" onClick={onClose}>
      <div className="br-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="br-modal-topglow" />

        <button className="br-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {title && (
          <div className="br-modal-header">
            <div className="br-modal-title">{title}</div>
          </div>
        )}

        <div className="br-modal-body">{children}</div>
      </div>

      <style>{`
        .br-modal-overlay{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.78);
          z-index: 99999;
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 18px;
        }

        /* Responsive sizing */
        .br-modal{
          width: 65vw;
          height: 85vh;
          max-width: 1650px;
          background: #1A1A1A;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 18px;
          box-shadow: 0 22px 70px rgba(0,0,0,0.75);
          overflow: hidden;
          position: relative;
          animation: brSlideIn 220ms ease-out;
        }
        @media (max-width: 1400px){
          .br-modal{ width: 75vw; }
        }
        @media (max-width: 900px){
          .br-modal{ width: 95vw; height: 92vh; border-radius: 16px; }
        }

        .br-modal-topglow{
          position:absolute;
          inset:0;
          pointer-events:none;
          background: radial-gradient(900px 260px at 15% 0%, rgba(201,160,73,0.14) 0%, rgba(201,160,73,0.00) 60%);
        }

        .br-modal-close{
          position:absolute;
          top: 14px;
          right: 14px;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(90,74,40,0.9);
          background: linear-gradient(180deg, #D9B563 0%, #C9A049 70%, #A88438 100%);
          color: #1A1A1A;
          cursor: pointer;
          font-size: 22px;
          font-weight: 900;
          line-height: 40px;
          box-shadow: 0 6px 0 rgba(168,132,56,0.7), 0 10px 20px rgba(201,160,73,0.25);
          z-index: 2;
        }
        .br-modal-close:hover{ filter: brightness(1.03); }
        .br-modal-close:active{ transform: translateY(2px); box-shadow: 0 4px 0 rgba(168,132,56,0.7), 0 8px 18px rgba(201,160,73,0.22); }

        .br-modal-header{
          padding: 18px 56px 10px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative;
          z-index: 1;
        }
        .br-modal-title{
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }

        .br-modal-body{
          height: 100%;
          overflow: auto;
          position: relative;
          z-index: 1;
        }

        @keyframes brSlideIn{
          from { opacity: 0; transform: translateY(18px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
