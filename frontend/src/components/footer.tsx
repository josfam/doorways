import githubLogo from "@/assets/icons/github.svg";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 z-10 flex h-16 w-full items-center justify-center rounded-t-lg bg-slate-200">
      <p className="flex items-center justify-center gap-6 text-lg text-slate-700">
        <a href="https://github.com/josfam/doorways" target="blank_">
          <img
            src={githubLogo}
            alt="github logo that links to the project github repository"
            className="h-8 w-8"
          />
        </a>
        Copyright 2025
      </p>
    </footer>
  );
};
