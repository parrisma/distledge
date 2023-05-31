import NavigationBar from "./NavigationBar"
import Header from "./Header";
import Console from "./Console";
import { useConsoleLogContext } from "../context/consoleLog";


export default function Layout({ children }) {

    const [logs] = useConsoleLogContext();

    return (
        <>
        <div >
        <Header />         
         <div>
          <NavigationBar></NavigationBar>          
         </div>
         <main>{children}</main>
        <Console outputContent={logs} />
      </div>
    </>
    );
  }