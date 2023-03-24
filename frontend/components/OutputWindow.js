
export default function OutputWindow(params) {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <div className="ml-auto py-2 px-4">
      <div className="bg-lightblue p-10 rounded-5">
          <p>{params.outputContent}</p>
        </div>
      </div>
    </nav>
  );
}
