import { FC } from "react";
import { SettingContent } from "./setting-content";
import { SettingDecoration } from "./setting-decoration";


export const Setting: FC = () => {
  return (
    <div className="w-full flex flex-col items-stretch gap-1">
      <div className="collapse collapse-arrow rounded-none">
        <input title="Content" type="radio" name="setting" defaultChecked />
        <div className="collapse-title text-xl font-medium bg-base-100">Nội dung</div>
        <div className="collapse-content">
          <SettingContent />
        </div>
      </div>
      <div className="collapse collapse-arrow rounded-none">
        <input title="Decoration" type="radio" name="setting" />
        <div className="collapse-title text-xl font-medium bg-base-100">Trang trí</div>
        <div className="collapse-content">
          <SettingDecoration />
        </div>
      </div>
    </div>
  );
};
