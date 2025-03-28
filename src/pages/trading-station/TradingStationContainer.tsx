import { useParams, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/wrappers/ProtectedRoute';
import Mt4Licenses2 from '../mt4licenses2/Mt4Licenses2';

export const tradingStationVersions = {
  '2.6': { version: '2.6', idProduct: 125 },
  '2.7': { version: '2.7', idProduct: 170 },
  '2.8': { version: '2.8', idProduct: 177 },
};

export type TradingStationVersion = keyof typeof tradingStationVersions;

const TradingStationContainer = () => {
  const { version } = useParams<{ version: string }>();
    const validVersion = version as TradingStationVersion;
  if (!validVersion || !tradingStationVersions[validVersion]) {
    return <Navigate to="/trading-station/2.8" replace />;
  }

  const { idProduct } = tradingStationVersions[validVersion];

  return (
    <ProtectedRoute>
      <Mt4Licenses2 
        idProduct={idProduct}
        version={validVersion}
      />
    </ProtectedRoute>
  );
};

export default TradingStationContainer;