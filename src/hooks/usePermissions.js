import { useUserContext } from "@/providers/UserProvider"
import { useEffect, useMemo, useState } from "react"

/**
    * bu hook aşağıdakı interfacedə props alır və lazım olan icazələri tapır
    * 
    * aşağıdakı kimi props alır
    * 
    * { 
    *   create: string // claimName;
    *   delete: string // claimName;
    *   update: string // claimName;
    *   və s.
    * }
    * 
    * 
    * aşağıdakı nümunəyə uyğun data qaytarır:
    * 
    * {
    *   create: boolean,
    *   delete: boolean,
    *   hasAll: (keys: string[]) => boolean,
    *   hasAny: (keys: string[]) => boolean,
    *   isAllowed: (key: string) => boolean,
    *   ready: boolean, // icazələr tam yoxlanıb və hesablanıbsa true əks halda false
    * }
    * 
    * istifadəsinə dair nümunə
    * if (perm.create) console.log("Yarada bilər!")
    * if (perm.isAllowed("delete")) console.log("Silə bilər")
    * if (perm.hasAll(["create", "update"])) console.log("Hər iki icazə var")
    * if (perm.hasAny(["delete", "update"])) console.log("Ən azı biri var")
*/

const usePermissions = (obj) => {
    const [result, setResult] = useState({})
    const [ready, setReady] = useState(false);
    const { permissions } = useUserContext()
    // permission interface aşağıdakı kimidir { claimName: string, hasAccess: boolean }[]
    useEffect(() => {
        if (!obj || typeof obj !== "object" || Object.keys(obj).length === 0) return;

        const values = Object.entries(obj)
        if (values.length === 0) return

        const computed = Object.entries(obj).reduce((acc, [key, claimName]) => {
            const found = permissions.find(p => p.claimName === claimName)
            acc[key] = found?.hasAccess || false
            return acc
        }, {})
        setResult(computed)
        setReady(true);

    }, [permissions])


    const helpers = useMemo(() => {
        const isAllowed = (key) => !!result[key];
        const hasAll = (keys = []) => keys.every((k) => !!result[k]);
        const hasAny = (keys = []) => keys.some((k) => !!result[k]);

        return {
            ...result,
            ready,
            isAllowed,
            hasAll,
            hasAny,
        };
    }, [result, ready]);


    return helpers
}

export default usePermissions


//  Auth: UserId-yə görə permission qrupların siyahısı
// +  Auth: İstifadəçini permission qrupa əlavə et/sil
// +  Auth: İstifadəçilər siyahısı
//  Auth: İstifadəçi məlumatlarına id-yə görə baxmaq
// +  Auth: İstifadəçini deaktiv/aktiv etmək
// +  Auth: İstifadəçi yaratmaq
// +  Auth: İstifadəçi yeniləmə
// +  Auth: İstifadəçi şifrə yeniləmə

// +  B2BMüştərilər: Müştərilər listi
//  B2BMüştərilər: Müştəri məlumatı
// +  B2BMüştərilər: Müştəri aktiv/deaktiv etmə
// +  B2BMüştərilər: B2BMüştəri yaratma
// +  B2BMüştərilər: Admin B2BMüştəri məlumatlarını yeniləmə
// +  B2BMüştərilər: B2BMüştəri şifrə yeniləmə
// +  B2BMüştərilər: Sirab tərəfindən B2BMüştəri məlumatlarını təsdiqləmə

// +  B2BCustomerGroup: Müştəri qrupu siyahısı
//  B2BCustomerGroup: Müştəri qrupu məlumatları id-yə görə sorğulama
// +  B2BCustomerGroup: Müştəri qrupu yaratmaq
// +  B2BCustomerGroup: Müştəri qrupu düzəliş etmək
// +  B2BCustomerGroup: Müştəri qrupu silmək

// +  Banner: Banner yaratmaq
// +  Banner: Bannerlərin siyahısı
//  Banner: Banner məlumatı İd-yə görə baxmaq
//  Banner: Banner məlumatına müştəriyə görə baxmaq

//  Inventory: Inventar siyahısı
//  Inventory: Inventar id-yə görə məlumata baxmaq
//  Inventory: Inventar yaratmaq
//  Inventory: Inventar düzəliş etmək
//  Inventory: Inventar silmək
