import { Outlet } from "react-router";
import bg from "../assets/bg.jpg";
const PlainLayout = () => {
  return (
    <>
      <div
        className="min-h-dvh max-h-screen overflow-hidden flex justify-center bg-cover"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        {/* PHONE CONTAINER */}
        <div className="relative  w-full max-w-[420px] overflow-auto  bg-gray-100 min-h-dvh shadow-xl">
          {/* Scrollable content */}
          <main className="h-full overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
export default PlainLayout;
