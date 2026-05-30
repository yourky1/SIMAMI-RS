import QRCode from "qrcode";

export async function generateAssetQrDataUrl(asset) {
  return QRCode.toDataURL(JSON.stringify({
    assetId: asset.id,
    name: asset.name,
    location: asset.location
  }));
}
