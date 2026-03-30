export default function Footer() {
    return (
        <footer className="w-full bg-white max-h-xl py-4 px-[40px] flex flex-col flex-wrap dark:bg-black dark: text-white">
            <div className="upper-footer h-1/2 flex flex-row justify-between">
                <div className="left-up-footer ">
                    <h2 className="text-xl font-bold">
                        VideoTube
                    </h2>
                    <p class="text-gray-500 text-sm ">Stream your favorite videos anytime, anywhere.</p>
                </div>
                <div className="left-up-footer">
                    {/* add an about page later */}
                </div>
            </div>
            <hr />
            <div className="lower-footer h-1/2 flex flex-row w-full justify-center pt-3">
                <p className="text-gray-500 text-sm">© 2026 VideoTube by Kenny. All rights reserved.</p>
            </div>
        </footer>   
    )
}