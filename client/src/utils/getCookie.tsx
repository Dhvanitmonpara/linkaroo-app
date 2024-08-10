// function getCookie(name: string): string | undefined {
//   const value = `; ${document.cookie}`;
//   const parts: string[] = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift();
// }

// function getCookie(name: string): string | null {
//     // Split cookie string and get all individual name=value pairs in an array
//     const cookieArr = document.cookie.split(";");

//     // Loop through the array elements
//     for(let i = 0; i < cookieArr.length; i++) {
//         const cookiePair: string | string[] = cookieArr[i].split("=");

//         /* Removing whitespace at the beginning of the cookie name
//         and compare it with the given string */
//         if(name == cookiePair[0].trim()) {
//             // Decode the cookie value and return
//             return decodeURIComponent(cookiePair[1]);
//         }
//     }

//     // Return null if not found
//     return null;
// }

function getCookie(name: string): string | undefined {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name+"="))
    ?.split("=")[1];

  if (cookieValue) {
    return decodeURIComponent(cookieValue);
  }
}

export default getCookie;
