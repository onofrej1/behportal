export default function Footer() {
  return (
    <footer className="bg-black py-8 px-20 shadow-md z-10 flex justify-content-center align-items-center dark:bg-slate-900 dark:text-white">
      <div className="text-sm text-white">
        Copyright © 2023 My Company
      </div>
      <div className="flex ml-auto gap-4">
        <a
          href="#"
          className="text-white dark:text-gray-500 hover:dark:text-gray-700"
        >
          Terms & Conditions
        </a>
        <a
          href="#"
          className="text-white"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
