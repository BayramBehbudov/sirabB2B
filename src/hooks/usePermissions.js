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


// 1. Auth: UserId - yə görə permission qrupların siyahısı
// 2. Auth: İstifadəçini permission qrupa əlavə et / sil
// 3. Auth: İstifadəçilər siyahısı
// 4. Auth: İstifadəçi məlumatlarına id - yə görə baxmaq
// 5. Auth: İstifadəçini deaktiv / aktiv etmək
// 6. Auth: İstifadəçi yaratmaq
// 7. Auth: İstifadəçi şifrə yeniləmə
// 8. B2BMüştərilər: Müştərilər listi
// 9. B2BMüştərilər: Müştəri məlumatı
// 10. B2BMüştərilər: Müştəri aktiv / deaktiv etmə
// 11. B2BMüştərilər: B2BMüştəri yaratma
// 12. B2BMüştərilər: Admin B2BMüştəri məlumatlarını yeniləmə
// 13. B2BMüştərilər: B2BMüştəri şifrə yeniləmə
// 14. B2BMüştərilər: Sirab tərəfindən B2BMüştəri məlumatlarını təsdiqləmə
// 15. B2BCustomerGroup: Müştəri qrupu siyahısı
// 16. B2BCustomerGroup: Müştəri qrupu məlumatları id - yə görə sorğulama
// 17. B2BCustomerGroup: Müştəri qrupu yaratmaq
// 18. B2BCustomerGroup: Müştəri qrupu düzəliş etmək
// 19. B2BCustomerGroup: Müştəri qrupu silmək
// 20. Banner: Banner yaratmaq
// 21. Banner: Bannerlərin siyahısı
// 22. Banner: Banner məlumatı İd - yə görə baxmaq
// 23. Banner: Banner məlumatına müştəriyə görə baxmaq
// 24. Inventory: Inventar siyahısı
// 25. Inventory: Inventar id - yə görə məlumata baxmaq
// 26. Inventory: Inventar yaratmaq
// 27. Inventory: Inventar düzəliş etmək
// 28. Inventory: Inventar silmək
