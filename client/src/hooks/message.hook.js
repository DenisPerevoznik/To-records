// import { useCallback } from "react";
// import {toast} from "react-toastify";

// const params = {
//     position: "top-right",
//     autoClose: 5000,
//     hideProgressBar: true,
//     closeOnClick: true,
//     pauseOnHover: false,
//     draggable: true,
//     progress: undefined,
// };

// export const useMessage = () => {

//     return useCallback((text, type) => {

//         if(text){

//             switch (type) {
//                 case "error":
//                     toast.error(text, params);
//                     break;
    
//                 case "success":
//                     toast.success(text, params);
//                     break;
            
//                 default:
//                     throw new Error(`Error useMessage, type "${type}" is not defined`)
//             }
//         }
        
//     }, []);
// }