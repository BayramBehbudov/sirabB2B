import {
  CreateProduct,
  GetAllProductCategories,
  GetAllUnitDefinition,
  GetProductById,
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

const AddProduct = () => {
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = id && /^[1-9]\d*$/.test(id);

  const defaultValues = {
    erpId: "",
    name: "",
    description: "",
    productCategoryId: 0,
    productUnits: [
      {
        unitDefinitionId: null,
        unit: null,
      },
    ],
    productPrices: [
      {
        price: null,
        startDate: "",
        endDate: "",
        priority: 1,
        isVAT: false,
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

  const getAllUnitsAndCategories = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        GetAllProductCategories({
          pageNumber: 1,
          pageSize: 10000000,
          order: "",
          orderColumn: "",
          searchList: [],
        }),
        GetAllUnitDefinition(),
      ]);
      setCategories(res1.productCategories);
      setUnits(res2.data);
    } catch (error) {
      console.log("error at getAllUnitsAndCategories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUnitsAndCategories();
  }, []);

  const getProduct = async () => {
    try {
      const res = await GetProductById(id);
      console.log(res);
    } catch (error) {
      console.log("error at getProduct", error);
    }
  };
  useEffect(() => {
    if (!isEdit) return;
    getProduct();
  }, [id]);

  const onSubmit = async (formData) => {
    try {
      const formatted = {
        ...formData,
        productImages: formData.productImages.map((image) => {
          return {
            fileName: image.fileName,
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

  return (
    <div className="flex flex-col gap-6 p-2 overflow-y-auto scrollbar">
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
      <ImageControllerForProduct control={control} errors={errors} />

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
