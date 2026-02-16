import {
  CreateProduct,
  GetAllProductCategories,
  GetAllUnitDefinition,
  GetProductById,
  UpdateProduct,
} from "@/api/Products";
import ControlledDropdown from "@/components/ui/ControlledDropdown";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { ProductSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import UnitController from "./components/UnitController";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import PriceController from "./components/PriceController";
import ImageControllerForProduct from "./components/ImageControllerForProduct";
import usePermissions from "@/hooks/usePermissions";

const AddProduct = () => {
  const { id } = useParams();
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [editedProduct, setEditedProduct] = useState(null);
  const navigate = useNavigate();
  const isEdit = id && /^[1-9]\d*$/.test(id);

  const perms = usePermissions({
    showAll: "PRODUCT: PRODUCT_LIST",
    show: "PRODUCT: GET_PRODUCT_ID",
    create: "PRODUCT: CREATE_PRODUCT",
    update: "PRODUCT: UPDATE_PRODUCT",
    showCats: "PRODUCT_CATEGORY: PRODUCT_CATEGORY_LIST",
    showUnits: "UNIT_DEFINITION: UNIT_DEFINITION_LIST",
  });

  const hasShow = perms.isAllowed("show");
  const hasShowAll = perms.isAllowed("showAll");
  const hasUpdate = perms.isAllowed("update");
  const hasShowDependencies = perms.hasAll(["showCats", "showUnits"]);
  const hasOperations = perms.hasAny(["create", "update"]);

  const defaultValues = {
    erpId: "",
    name: "",
    description: "",
    productCategoryId: 0,
    productUnits: [
      {
        unitDefinitionId: null,
        unit: null,
        id: 0,
      },
    ],
    productPrices: [
      {
        price: null,
        startDate: "",
        endDate: "",
        priority: 1,
        isVAT: false,
        id: 0,
      },
    ],
    productImages: [],
  };
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const getProduct = async () => {
    try {
      const res = await GetProductById(id);
      const productData = {
        ...res.data,
        productUnits: res.data.productUnits.map((unit) => {
          return {
            id: unit.productUnitId,
            unitDefinitionId: unit.unitDefinitionId,
            unit: unit.unit,
          };
        }),
        productPrices: res.data.productPrices.map((price) => {
          return {
            id: price.priceId,
            isVAT: price.isVAT,
            price: price.price,
            priority: price.priority,
            startDate: price.startDate,
            endDate: price.endDate,
          };
        }),
        productImages: res.data.productImages.map((image) => {
          return {
            fileName: image.fileName,
            base64: image.filePath,
            type: "image/",
            id: image.productImageId,
          };
        }),
      };
      setEditedProduct(productData);
      reset(productData);
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail: t("productNotFound"),
      });

      navigate("/page-not-found");
    }
  };
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const res1 = await GetAllProductCategories({
        pageNumber: 1,
        pageSize: 1000000000,
        order: "",
        orderColumn: "",
        searchList: [],
      });
      setCategories(res1.productCategories);
      const res2 = await GetAllUnitDefinition();
      setUnits(res2.data);

      if (!isEdit) return;
      if (!hasUpdate || !hasShow)
        return navigate("/not-allowed", { replace: true });
      getProduct();
    } catch (error) {
      console.log("error at getAllUnitsAndCategories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!hasShowDependencies || !hasOperations || !hasShowAll)
      return navigate("/not-allowed", { replace: true });
    loadInitialData();
  }, [perms.ready]);

  const onCreate = async (formData) => {
    try {
      const formatted = {
        ...formData,
        productImages: formData.productImages.map((image) => {
          return {
            ...image,
            base64: image.base64.split(",")[1],
          };
        }),
      };
      setLoading(true);
      const res = await CreateProduct(formatted);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
    } catch (error) {
      console.log("error at onSubmit", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };
  const onUpdate = async (formData) => {
    try {
      const formattedImages = formData.productImages
        .map((image) => {
          return {
            ...image,
            base64: image.base64.split(",")[1],
          };
        })
        .filter((image) => image.id === 0);
      const deletedProductImageIds = editedProduct.productImages
        .filter(
          (image) =>
            !formData.productImages.some((fImage) => fImage.id === image.id),
        )
        .map((image) => image.id);

      const deletedProductPriceIds = editedProduct.productPrices
        .filter(
          (price) =>
            !formData.productPrices.some((fPrice) => fPrice.id === price.id),
        )
        .map((price) => price.id);
      const deletedProductUnitIds = editedProduct.productUnits
        .filter(
          (unit) =>
            !formData.productUnits.some((fUnit) => fUnit.id === unit.id),
        )
        .map((unit) => unit.id);

      setLoading(true);
      const formattedValue = {
        ...formData,
        productImages: formattedImages,
        deletedProductImageIds,
        deletedProductPriceIds,
        deletedProductUnitIds,
        id,
      };
      const res = await UpdateProduct(formattedValue);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
    } catch (error) {
      console.log("error at onUpdate", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (formValue) => {
    if (isEdit) {
      onUpdate(formValue);
    } else {
      onCreate(formValue);
    }
  };

  return (
    <div className="flex flex-col gap-6  overflow-y-auto scrollbar">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t(isEdit ? "editProduct" : "addProduct")}
          </p>
        </div>
        <div>
          <Button
            label={t("goBack")}
            icon="pi pi-arrow-left"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 border p-3 rounded-md border-gray-200">
        <label className="font-bold">{t("generalInformation")}:</label>
        <div className="flex flex-row gap-2 flex-wrap">
          {[{ name: "name" }, { name: "erpId" }].map((inp) => {
            return (
              <ControlledInput
                key={inp.name}
                control={control}
                name={inp.name}
                type={inp.type}
                label={t(inp.name)}
                className={`w-[250px]`}
              />
            );
          })}
          <ControlledDropdown
            control={control}
            name="productCategoryId"
            label={t("category")}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            loading={loading}
            disabled={loading}
            className={`!w-[250px]`}
          />
        </div>

        <div className="flex flex-row gap-2 flex-wrap">
          <ControlledInput
            control={control}
            name="description"
            type="textarea"
            label={t("description")}
            classNameContainer="flex-1 "
            rows={3}
          />
        </div>
      </div>
      <UnitController
        control={control}
        units={units}
        formUnits={watch("productUnits")}
      />
      <PriceController control={control} formPrices={watch("productPrices")} />
      <ImageControllerForProduct
        control={control}
        errors={errors}
        isEdit={isEdit}
      />

      <div className={`flex items-center justify-end mt-10 `}>
        <Button
          label={t(isEdit ? "confirm" : "save")}
          icon="pi pi-plus"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      <FullScreenLoader visible={loading} />
    </div>
  );
};

export default AddProduct;
