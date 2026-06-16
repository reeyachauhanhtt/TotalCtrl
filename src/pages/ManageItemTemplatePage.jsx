import TemplatePanel from "../components/Settings/ManageItemTemplate/TemplatePanel";
import TemplateMainSection from "../components/Settings/ManageItemTemplate/TemplateMainSection";
import ItemTable from "../components/Settings/ManageItemTemplate/ItemTable";

const ManageItemTemplatePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <TemplatePanel />
      <TemplateMainSection />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ItemTable />
      </div>
    </div>
  );
};

export default ManageItemTemplatePage;
