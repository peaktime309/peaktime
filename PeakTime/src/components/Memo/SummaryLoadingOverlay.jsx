import { SyncLoader } from "react-spinners";

const SummaryLoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SyncLoader color="#66AADF" height={100} width={100} />
    </div>
  )
}

export default SummaryLoadingOverlay;