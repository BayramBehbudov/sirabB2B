import Home from "../pages/Home/Home";
import Users from "../pages/Users/Users";
import Customers from '../pages/Customers/Customers'
import Requests from "../pages/Requests/Requests";
import Parameters from "../pages/Parameters/Parameters";
import Notifications from "../pages/Notifications/Notifications";
import Ratings from "../pages/Ratings/Ratings";
import Discounts from '../pages/Discounts/Discounts'
import Banners from '../pages/Banners/Banners'
import {
    FaHome,
    FaUsers,
    FaFileAlt,
    FaUserCog,
    FaBell,
    FaStar,
    FaFileContract,
    FaTags,
    FaImage,
    FaTerminal,
    FaRegListAlt,
} from "react-icons/fa";
import CustomerGroups from "@/pages/Customers/groups/Groups";
import NotificationTypes from "@/pages/Notifications/Types/NotificationTypes";
import NotificationTemplates from "@/pages/Notifications/Forms/NotificationTemplates";
import ClaimGroups from "@/pages/ClaimGroups/ClaimGroups";
import DocumentTypes from "@/pages/Parameters/documentTypes/DocumentTypes";
import Products from "@/pages/Products/Products";
import ProductCategories from "@/pages/Products/Categories/ProductCategories";
import ProductUnits from "@/pages/Products/Units/ProductUnits";
import SaleConditions from "@/pages/SaleConditions/SaleConditions";
import InventoryCheckRequirement from "@/pages/Parameters/InventoryCheckRequirement/InventoryCheckRequirement";

// qeyd permission all olan səhifələr  hamıya görünür
const routes = [
    {
        id: 1, path: "/",
        label: "Əsas Səhifə", children: [],
        component: Home, icon: FaHome,
        permission: 'all',

    },
    {
        id: 2, path: "/customers",
        label: "Müştərilər",
        component: Customers, icon: FaUsers,
        permission: "B2BMüştərilər: Müştərilər listi",
        children: [
            {
                id: "2-1", path: "/customers/groups",
                label: "Müştəri qrupları",
                component: CustomerGroups,
                permission: "B2BCustomerGroup: Müştəri qrupu siyahısı",
            },
        ],
    },

    {
        id: 3, path: "/users",
        label: "İstifadəçilər",
        component: Users, icon: FaUserCog,
        permission: "Auth: İstifadəçilər siyahısı",
        children: []
    },
    {
        id: 4, path: "/products",
        label: "Məhsullar",
        component: Products, icon: FaRegListAlt,
        permission: "Məhsul: Məhsulları görmək",
        children: [
            {
                id: "4-1", path: "/product-categories",
                label: "Məhsul kateqoriyaları",
                component: ProductCategories,
                permission:
                    "Məhsul kateqoriyası: Məhsul kateqoriyaları görmək"
                ,
            },
            {
                id: "4-2", path: "/product-units",
                label: "Məhsul vahidləri",
                component: ProductUnits,
                permission: "Vahid: Vahidləri görmək"
            }]
    },
    {
        id: 5, path: "/parameters",
        label: "Standart parametrlər",
        component: Parameters, icon: FaFileContract,
        permission: 'all',
        children: [
            {
                id: "5-1", path: "/document-types",
                label: "Sənəd tipləri",
                permission: "Sənəd növü: Sənəd növlərini görmək",
                component: DocumentTypes,

            },
            {
                id: "5-2", path: "/inventory-check-requirement",
                label: "Inventarlar",
                permission: "all",
                component: InventoryCheckRequirement,
            },
        ]
    },
    {
        id: 6, path: "/notifications",
        component: Notifications, icon: FaBell,
        label: "Bildiriş göndərilməsi",
        permission: "Bildiriş: Bildirişləri görmək",
        children: [
            {
                id: "6-1", path: "/notifications/types",
                label: "Bildiriş tipləri",
                permission: "Bildiriş tipi: Bildiriş tiplərini görmək",
                component: NotificationTypes
            },
            {
                id: "6-2", path: "/notifications/forms",
                label: "Bildiriş formaları",
                permission: "Bildiriş şablonu: Bildiriş şablonlarını görmək",
                component: NotificationTemplates
            }
        ]
    },
    {
        id: 7, path: "/ratings",
        component: Ratings, icon: FaStar,
        label: "Qiymətləndirmələr",
        permission: "all",
        children: []
    },
    {
        id: 8, path: "/sales-conditions",
        component: SaleConditions, icon: FaFileContract,
        label: "Satış şərtləri",
        permission: "all",
        children: []
    },
    {
        id: 9, path: "/discounts",
        component: Discounts, icon: FaTags,
        label: "Endirimlər",
        permission: "all",
        children: []
    },
    {
        id: 10, path: "/banners",
        component: Banners, icon: FaImage,
        label: "Bannerlər",
        permission: "Banner: Bannerlərin siyahısı",
        children: []
    },
    {
        id: 11, path: "/requests",
        label: "Qeydiyyat müraciətləri",
        component: Requests, icon: FaFileAlt,
        permission: "Müştəri sənədi: Müştəri sənədlərini görmək",
        children: []
    },
    {
        id: 12, path: "/claim-groups",
        label: "İcazə qrupları",
        component: ClaimGroups, icon: FaTerminal,
        permission: "Auth: UserId-yə görə permission qrupların siyahısı",
        children: []
    },
];


export default routes;
