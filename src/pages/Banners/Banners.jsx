import { GetAllBanners } from "@/api/Banner";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { formatDate } from "@/helper/DateFormatter";
import { showToast } from "@/providers/ToastProvider";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BannerPhotos } from "./components/BannerPhotos";
import BannerCustomers from "./components/BannerCustomers";
import AddBanner from "./components/AddBanner";

const Banners = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBanners = async () => {
    try {
      setLoading(true);
      const res = await GetAllBanners();
      setBanners(res);
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("banners")}</p>
        </div>
        <div className="flex flex-row gap-2">
          <AddBanner />
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={banners}
          loading={loading}
          {...tableStaticProps}
          lazy={false}
          rows={10}
        >
          <Column field="title" header={t("title")} />
          <Column field="description" header={t("description")} />
          <Column
            field="isGlobal"
            header={t("type")}
            body={(data) =>
              data.isGlobal ? t("allCustomers") : t("selectedCustomers")
            }
          />
          <Column
            field="startDate"
            header={t("startDate")}
            body={(data) => {
              return formatDate(data.startDate);
            }}
          />
          <Column
            field="endDate"
            header={t("endDate")}
            body={(data) => {
              return formatDate(data.endDate);
            }}
          />
          <Column
            body={(data) => {
              return (
                <div className="flex flex-row gap-2">
                  <BannerPhotos images={data.bannerImages} />
                  <BannerCustomers customers={data.bannerCustomers} />
                </div>
              );
            }}
          />
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default Banners;
