import Home from "../pages/Home/Home";
import Users from "../pages/Users/Users";
import Customers from '../pages/Customers/Customers'
import Requests from "../pages/Requests/Requests";
import Parameters from "../pages/Parameters/Parameters";
import Notifications from "../pages/Notifications/Notifications";
import Ratings from "../pages/Ratings/Ratings";
import SalesTerms from '../pages/SalesTerms/SalesTerms'
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


const routes = [
    {
        id: 1, path: "/",
        label: "Əsas Səhifə", children: [],
        component: Home, icon: FaHome,
    },
    {
        id: 2, path: "/customers",
        label: "Müştərilər",
        component: Customers, icon: FaUsers,
        children: [
            {
                id: "2-1", path: "/customers/groups",
                label: "Müştəri qrupları",
                component: CustomerGroups
            },
        ],
    },

    {
        id: 3, path: "/users",
        label: "İstifadəçilər",
        component: Users, icon: FaUserCog,
        children: []
    },
    {
        id: 4, path: "/products",
        label: "Məhsullar",
        component: Products, icon: FaRegListAlt,
        children: [
            {
                id: "4-1", path: "/product-categories",
                label: "Məhsul kateqoriyaları",
                component: ProductCategories,
            },
            {
                id: "4-2", path: "/product-units",
                label: "Məhsul vahidləri",
                component: ProductUnits,
            }]
    },
    {
        id: 5, path: "/parameters",
        label: "Standart parametrlər",
        component: Parameters, icon: FaFileContract,
        children: [
            {
                id: "5-1", path: "/document-types",
                label: "Sənəd tipləri",
                component: DocumentTypes,
            },
        ]
    },
    {
        id: 6, path: "/notifications",
        component: Notifications, icon: FaBell,
        label: "Bildiriş göndərilməsi",
        children: [
            {
                id: "6-1", path: "/notifications/types",
                label: "Bildiriş tipləri",
                component: NotificationTypes
            },
            {
                id: "6-2", path: "/notifications/forms",
                label: "Bildiriş formaları",
                component: NotificationTemplates
            }
        ]
    },
    {
        id: 7, path: "/ratings",
        component: Ratings, icon: FaStar,
        label: "Qiymətləndirmələr",
        children: []
    },
    {
        id: 8, path: "/sales-terms",
        component: SalesTerms, icon: FaFileContract,
        label: "Satış şərtləri",
        children: []
    },
    {
        id: 9, path: "/discounts",
        component: Discounts, icon: FaTags,
        label: "Endirimlər",
        children: []
    },
    {
        id: 10, path: "/banners",
        component: Banners, icon: FaImage,
        label: "Banner və popup",
        children: []
    },
    {
        id: 11, path: "/requests",
        label: "Qeydiyyat müraciətləri",
        component: Requests, icon: FaFileAlt,
        children: []
    },
    { id: 12, path: "/claim-groups", component: ClaimGroups, icon: FaTerminal, label: "İcazə qrupları", children: [] },
    // { id: 11, path: "/newroute", component: NewRouteComponent, icon: NewRouteIcon, label: "New Route", children: [] },
];


export default routes;
