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
} from "react-icons/fa";
import CustomerGroups from "@/pages/Customers/groups/Groups";
import NotificationTypes from "@/pages/Notifications/Types/NotificationTypes";
import NotificationTemplates from "@/pages/Notifications/Forms/NotificationTemplates";
import ClaimGroups from "@/pages/ClaimGroups/ClaimGroups";


const routes = [
    {
        id: 1, path: "/",
        component: Home, icon: FaHome,
        label: "Əsas Səhifə", children: []
    },
    {
        id: 2, path: "/customers",
        component: Customers, icon: FaUsers,
        label: "Müştərilər",
        children: [
            {
                id: "2-1", path: "/customers/groups",
                label: "Müştəri qrupları",
                component: CustomerGroups
            },
        ],
    },
    {
        id: 3, path: "/requests",
        component: Requests,
        icon: FaFileAlt,
        label: "Qeydiyyat müraciətləri",
        children: []
    },
    {
        id: 4, path: "/users",
        component: Users, icon: FaUserCog,
        label: "İstifadəçilər",
        children: []
    },
    {
        id: 5, path: "/parameters",
        component: Parameters, icon: FaFileContract,
        label: "Standart parametrlər",
        children: []
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
    { id: 11, path: "/claim-groups", component: ClaimGroups, icon: FaTerminal, label: "İcazə qrupları", children: [] },
    // { id: 11, path: "/newroute", component: NewRouteComponent, icon: NewRouteIcon, label: "New Route", children: [] },
];


export default routes;
