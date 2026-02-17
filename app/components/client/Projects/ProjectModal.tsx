import { useEffect } from "react";

import useProjectModalStore from "~/stores/ProjectModalStore";

const ProjectModal = () => {
  const open = useProjectModalStore((state) => state.open);
  const innerContent = useProjectModalStore((state) => state.innerContent);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "scroll";
    }

    return () => {
      document.documentElement.style.overflow = "scroll";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center md:justify-center bg-black/50 p-4 overflow-scroll w-screen ${
        !open && "hidden"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg bg-white shadow-lg">
        {innerContent}
      </div>
    </div>
  );
};

export default ProjectModal;
