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
    FaCalendarCheck,
    FaFileImage,
    FaRegFileImage
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
import InventoryCheckRequirement from "@/pages/Inventory/InventoryCheckRequirement";
import InventoryCheckAssignment from "@/pages/Inventory/assignment/InventoryCheckAssignment";
import Popups from "@/pages/Popups/Popups";
import PrivacyDocuments from "@/pages/Parameters/privacyDocuments/PrivacyDocuments";
import PaymentTypes from "@/pages/Parameters/paymentTypes/PaymentTypes";
import OrderStatuses from "@/pages/Parameters/orderStatuses/OrderStatuses";
import RatingTypes from "@/pages/Ratings/Rating-types/RatingTypes";

// qeyd permission all olan səhifələr  hamıya görünür
const routes = [
    {
        id: 1, path: "/",
        label: "Əsas Səhifə",
        component: Home, icon: FaHome,
        permission: 'all',
        children: [],

    },
    {
        id: 2, path: "/customers",
        label: "Müştərilər",
        component: Customers, icon: FaUsers,
        permission: "B2BCUSTOMER: B2BCUSTOMER_LIST",
        children: [
            {
                id: "2-1", path: "/customers/groups",
                label: "Müştəri qrupları",
                component: CustomerGroups,
                permission: "B2BCUSTOMER_GROUP: B2BCUSTOMER_GROUP_LIST",
            },
        ],
    },

    {
        id: 3, path: "/users",
        label: "İstifadəçilər",
        component: Users, icon: FaUserCog,
        permission: "AUTH: SYSTEM_USER_LIST",
        children: []
    },
    {
        id: 4, path: "/products",
        label: "Məhsullar",
        component: Products, icon: FaRegListAlt,
        permission: "PRODUCT: PRODUCT_LIST",
        children: [
            {
                id: "4-1", path: "/product-categories",
                label: "Məhsul kateqoriyaları",
                component: ProductCategories,
                permission: "PRODUCT_CATEGORY: PRODUCT_CATEGORY_LIST"
            },
            {
                id: "4-2", path: "/product-units",
                label: "Məhsul vahidləri",
                component: ProductUnits,
                permission: "UNIT_DEFINITION: UNIT_DEFINITION_LIST"
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
                component: DocumentTypes,
                permission: "DOCUMENT_TYPE: DOCUMENT_TYPE_LIST",
            },
            {
                id: "5-2", path: "/privacy-documents",
                label: "Gizlilik sənədləri",
                component: PrivacyDocuments,
                permission: "PRIVACY_DOCUMENT: PRIVACY_DOCUMENT_LIST",
            },
            {
                id: "5-3", path: "/payment-types",
                label: "Ödəniş növləri",
                component: PaymentTypes,
                permission: "PAYMENT_TYPE: PAYMENT_TYPE_LIST",
            },
            {
                id: "5-4", path: "/order-statuses",
                label: "Sifariş statusları",
                component: OrderStatuses,
                permission: "ORDER_STATUS: ORDER_STATUS_LIST",
            },
        ]
    },
    {
        id: 6, path: "/notifications",
        component: Notifications, icon: FaBell,
        label: "Bildiriş göndərilməsi",
        permission: "NOTIFICATION: NOTIFICATION_LIST",
        children: [
            {
                id: "6-1", path: "/notifications/types",
                label: "Bildiriş tipləri",
                component: NotificationTypes,
                permission: "NOTIFICATION_TYPE: NOTIFICATION_TYPE_LIST",
            },
            {
                id: "6-2", path: "/notifications/forms",
                label: "Bildiriş formaları",
                component: NotificationTemplates,
                permission: "NOTIFICATION_TEMPLATE: NOTIFICATION_TEMPLATE_LIST",
            }
        ]
    },
    {
        id: 7, path: "/ratings",
        label: "Qiymətləndirmələr",
        component: Ratings, icon: FaStar,
        permission: "ORDER_EVALUATION: ORDER_EVALUATION_LIST",
        children: [
            {
                id: "7-1", path: "/ratings/types",
                label: "Qiymətləndirmə tipləri",
                component: RatingTypes,
                permission: "ORDER_EVALUATION_TYPE: ORDER_EVALUATION_TYPE_LIST",
            }
        ]
    },
    {
        id: 8, path: "/sales-conditions",
        label: "Satış şərtləri",
        component: SaleConditions, icon: FaFileContract,
        permission: "SALE_CONDITION: SALE_CONDITION_LIST",
        children: []
    },
    {
        id: 9, path: "/discounts",
        label: "Endirimlər",
        component: Discounts, icon: FaTags,
        permission: "DISCOUNT_CONDITION: DISCOUNT_CONDITION_LIST",
        children: []
    },
    {
        id: 10, path: "/banners",
        label: "Bannerlər",
        component: Banners, icon: FaImage,
        permission: "BANNER: BANNER_LIST",
        children: []
    },
    {
        id: 14, path: "/popups",
        label: "Popuplar",
        component: Popups, icon: FaRegFileImage,
        permission: "PROMO_POPUP: PROMO_POPUP_LIST",
        children: []
    },
    {
        id: 11, path: "/requests",
        label: "Qeydiyyat müraciətləri",
        component: Requests, icon: FaFileAlt,
        permission: "CUSTOMER_UPLOAD_DOCUMENT: CUSTOMER_UPLOAD_DOCUMENT_LIST",
        children: []
    },
    {
        id: "12", path: "/inventory-check-requirement",
        label: "Inventar yoxlama tələbləri",
        component: InventoryCheckRequirement, icon: FaCalendarCheck,
        permission: "INVENTORY: INVENTORY_REQUIREMENT_LIST",
        children: [
            {
                id: "12-1", path: "/inventory-check-assignment",
                label: "İnventar yoxlama siyahısı",
                component: InventoryCheckAssignment,
                permission: "INVENTORY: INVENTORY_LIST_CREATED_FOR_CUSTOMER",
            }
        ]
    },
    {
        id: 13, path: "/claim-groups",
        label: "İcazə qrupları",
        component: ClaimGroups, icon: FaTerminal,
        permission: "AUTH: GET_CLAIM_GROUP_BY_USER_ID",
        children: []
    },
];


export default routes;
