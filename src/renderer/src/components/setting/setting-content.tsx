import { FormControl } from "@components/ui/form-control";
import { useSettingStore } from "@store/setting";
import { FC } from "react";

export const SettingContent: FC = () => {
  const settingStore = useSettingStore();

  return (
    <div className="flex flex-col gap-4">
      <FormControl label="Tiêu đề phụ" name="title1">
        <input
          type="text"
          name="title2"
          placeholder="Quay số"
          className="input w-full"
          value={settingStore.title1}
          onChange={(e) => {
            settingStore.setTitle1(e.target.value);
          }}
        />
      </FormControl>

      <FormControl label="Tiêu đề chính" name="title2">
        <input
          type="text"
          name="title2"
          placeholder="Ngày Xuân"
          className="input w-full"
          value={settingStore.title2}
          onChange={(e) => {
            settingStore.setTitle2(e.target.value);
          }}
        />
      </FormControl>

      <FormControl label="Banner" name="banner">
        <textarea
          className="textarea"
          placeholder="Banner"
          value={settingStore.banner}
          onChange={(e) => settingStore.setBanner(e.target.value)}
        ></textarea>
      </FormControl>

      <FormControl label="Dãy số">
        <div className="bg-base-300 p-2 rounded-xl">
          <div className="grid grid-cols-2 gap-2">
            <FormControl label="Min" name="min">
              <input
                placeholder="Min: 1"
                type="number"
                name="min"
                className="input w-full"
                value={settingStore.numberRange[0]}
                onChange={(e) => {
                  settingStore.setNumberRange([
                    parseInt(e.target.value),
                    settingStore.numberRange[1],
                  ]);
                }}
                min={1}
              />
            </FormControl>
            <FormControl label="Max" name="max">
              <input
                placeholder="Max: 999"
                type="number"
                name="max"
                className="input w-full"
                value={settingStore.numberRange[1]}
                onChange={(e) => {
                  settingStore.setNumberRange([
                    settingStore.numberRange[0],
                    parseInt(e.target.value),
                  ]);
                }}
                min={settingStore.numberRange[0] + 1}
              />
            </FormControl>
            {settingStore.numberRange[0] >= settingStore.numberRange[1] && (
              <p className="text-xs text-error col-span-2">
                Min phải nhỏ hơn Max
              </p>
            )}
          </div>
        </div>
      </FormControl>

      <FormControl label="Nút">
        <div className="bg-base-300 p-2 rounded-xl">
          <div className="grid grid-cols-2 gap-2">
            <FormControl label="Nút Quay" name="startLabel">
              <input
                placeholder="Start"
                type="text"
                name="startLabel"
                className="input w-full"
                value={settingStore.startLabel}
                onChange={(e) => {
                  settingStore.setStartLabel(e.target.value);
                }}
              />
            </FormControl>

            <FormControl label="Nút Dừng" name="stopLabel">
              <input
                placeholder="Stop"
                type="text"
                name="stopLabel"
                className="input w-full"
                value={settingStore.stopLabel}
                onChange={(e) => {
                  settingStore.setStopLabel(e.target.value);
                }}
              />
            </FormControl>
          </div>
        </div>
      </FormControl>
    </div>
  );
};
