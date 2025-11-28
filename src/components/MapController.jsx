import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AutoComplete } from "primereact/autocomplete";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";
import MapPicker from "./MapPicker";
import { showToast } from "@/providers/ToastProvider";

const DEFAULT_LAT = 40.409264;
const DEFAULT_LNG = 49.867092;

const MapController = ({ locX, locY, onSelect }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapInstanceRef = useRef(null);
  const fallbackCoords = useMemo(() => {
    const lat = Number(locY);
    const lng = Number(locX);
    return {
      lat: Number.isFinite(lat) ? lat : DEFAULT_LAT,
      lng: Number.isFinite(lng) ? lng : DEFAULT_LNG,
    };
  }, [locX, locY]);

  const [markerPosition, setMarkerPosition] = useState(
    // value?.lat && value?.lng
    //   ? { lat: value.lat, lng: value.lng }
    //   :
    fallbackCoords
  );

  // useEffect(() => {
  //   if (value?.lat && value?.lng) {
  //     setMarkerPosition({ lat: value.lat, lng: value.lng });
  //     setSelectedLocation(value);
  //     setSearchValue(value.displayName ?? "");
  //   }
  // }, [value]);

  const fetchAddressDetails = useCallback(async (lat, lng) => {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat,
      lon: lng,
      addressdetails: "1",
      zoom: "18",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return undefined;

    return response.json();
  }, []);

  const updateSelectedLocation = useCallback(
    async (lat, lng, payload) => {
      setLoading(true);
      try {
        const data =
          payload ??
          (await fetchAddressDetails(lat.toFixed(6), lng.toFixed(6)));
        if (!data) {
          showToast({
            detail: t("unableRetrieveAddress"),
            severity: "warn",
          });
          return;
        }
        const normalized = {
          lat,
          lng,
          displayName: data?.display_name ?? `${lat}, ${lng}`,
          address: data?.address ?? {},
          raw: data ?? {},
        };
        setSelectedLocation(normalized);
        setSearchValue(normalized.displayName);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchAddressDetails]
  );

  const handleDialogOpen = () => {
    setVisible(true);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
      if (selectedLocation?.lat && selectedLocation?.lng) {
        mapInstanceRef.current?.setView(
          { lat: selectedLocation.lat, lng: selectedLocation.lng },
          16
        );
      }
    }, 100);
  };

  const handleDialogClose = () => {
    setVisible(false);
    setSelectedLocation(null);
    setSearchValue("");
    setSearchResults([]);
    setLoading(false);
  };

  const handleSelect = () => {
    if (selectedLocation && onSelect) {
      onSelect(selectedLocation);
    }
    setVisible(false);
  };

  const searchLocations = useCallback(async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        addressdetails: "1",
        namedetails: "1",
        limit: "10",
        countrycodes: "az",
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        { headers: { Accept: "application/json" } }
      );
      if (!response.ok) return;
      const data = await response.json();
      const formatted = data.map((item) => ({
        ...item,
        label: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
      }));
      setSearchResults(formatted);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSearchSelect = async (e) => {
    const item = e.value;
    if (!item) return;
    const coords = { lat: item.lat, lng: item.lng };
    setMarkerPosition(coords);
    mapInstanceRef.current?.setView(coords, 16);
    await updateSelectedLocation(coords.lat, coords.lng, item);
  };

  const infoRows = [
    {
      label: t("country"),
      value: selectedLocation?.address?.country,
    },
    {
      label: t("city"),
      value:
        selectedLocation?.address?.city ||
        selectedLocation?.address?.town ||
        selectedLocation?.address?.village,
    },
    {
      label: t("street"),
      value:
        selectedLocation?.address?.road ||
        selectedLocation?.address?.suburb ||
        selectedLocation?.address?.neighbourhood ||
        selectedLocation?.address?.street ||
        selectedLocation?.address?.residential,
    },
    {
      label: t("postalCode"),
      value: selectedLocation?.address?.postcode,
    },
    {
      label: t("coordinates"),
      value:
        selectedLocation?.lat.toFixed(6) +
        ", " +
        selectedLocation?.lng.toFixed(6),
    },
    {
      label: t("fullAddress"),
      value: selectedLocation?.displayName,
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Button
        icon={"pi pi-plus"}
        label={t("searchOnMap")}
        onClick={handleDialogOpen}
      />

      <Dialog
        header={t("searchAddress")}
        visible={visible}
        className="w-[90%] h-[90%]"
        onHide={handleDialogClose}
        footer={
          <div className="flex justify-end gap-4">
            <Button
              label={t("cancel")}
              className="!w-[150px]"
              onClick={handleDialogClose}
              severity="secondary"
            />
            <Button
              label={t("confirm")}
              className="!w-[150px]"
              onClick={handleSelect}
              disabled={!selectedLocation || loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <AutoComplete
            value={searchValue}
            suggestions={searchResults}
            completeMethod={(event) => searchLocations(event.query)}
            field="label"
            onChange={(e) => setSearchValue(e.value)}
            onSelect={handleSearchSelect}
            placeholder={t("search")}
            className="w-full p-2"
            dropdown
          />

          <div className="h-[420px] w-full overflow-hidden rounded-lg border border-slate-200">
            {visible && (
              <MapPicker
                markerPosition={markerPosition}
                mapInstanceRef={mapInstanceRef}
                setMarkerPosition={setMarkerPosition}
                updateSelectedLocation={updateSelectedLocation}
              />
            )}
          </div>

          {selectedLocation && (
            <div className="rounded-lg border border-slate-200 p-4 text-slate-700 bg-gray-50">
              <p className="mb-5 font-semibold text-xl text-gray-700">
                {t("addressDetails")}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {infoRows.map(
                  (row) =>
                    row.value && (
                      <div
                        key={row.label}
                        className="flex md:flex-row flex-col gap-1"
                      >
                        <span className="font-medium text-base uppercase text-slate-500">
                          {row.label}:
                        </span>
                        <span className="font-medium text-base">
                          {row.value}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default MapController;
