import { DisplayMap } from "@/constants";

/* 
** Look in the DisplayMap and return the alternate display name for the given name.
** If there is no matching name, just return the given name
*/
export function getDisplayName(nameToMapToDisplayName) {
    var displayName = nameToMapToDisplayName;
    DisplayMap.map.forEach((value) => {
        if (value.rawName === nameToMapToDisplayName) {
            displayName = value.displayName;
        }
    });
    return displayName;

}





