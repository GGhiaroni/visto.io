import { useParams } from "react-router-dom";

// /vistoria/: id / comodo /: roomId / item /: itemId

const ItemInspectionDetails = () => {
  const { id, roomId, itemId } = useParams();
  return <div>ItemInspectionDetails</div>;
};

export default ItemInspectionDetails;
