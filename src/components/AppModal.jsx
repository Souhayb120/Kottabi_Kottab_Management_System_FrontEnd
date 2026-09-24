import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * Single modal used across the whole app — consistent frame,
 * RTL-safe, one close affordance.
 */
const AppModal = ({
  open,
  onClose,
  title,
  children,
  footer = null,
  width = 480,
  labelledBy,
  maxWidth = 640,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby={labelledBy}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "modal-in 200ms var(--ease)",
            width: { xs: "92vw", sm: width },
            maxWidth: { xs: "92vw", sm: maxWidth },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--r-lg)",
            boxShadow: "var(--shadow-lg)",
            outline: "none",
            p: "22px",
          }}
        >
          <div className="mb-4 flex items-start justify-between gap-4 border-b border-(--border) pb-3">
            <h2
              id={labelledBy}
              className="font-display m-0 text-[17px] font-bold text-(--text)"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="icon-btn -me-1 -mt-1"
              aria-label="Fermer"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
          </div>

          {children}

          {footer && (
            <div className="mt-6 flex items-center justify-end gap-2">{footer}</div>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AppModal;