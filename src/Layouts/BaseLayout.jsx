import Navbar from "../Components/Navbar";

export default function BaseLayout({ children }) {
  return (
    <>
      <div className="flex flex-col bg-white w-full h-full">
        <Navbar />
        {children}
      </div>
    </>
  );
}
