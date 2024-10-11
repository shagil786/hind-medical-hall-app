export interface AddressModalProps {
  onClose: () => void;
  onSave: (address: AddressFormInputs) => void;
}

export interface AddressFormInputs {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const addressFields = [
  { name: 'street', placeholder: 'Street Address', required: 'Street address is required' },
  { name: 'city', placeholder: 'City', required: 'City is required' },
  { name: 'state', placeholder: 'State', required: 'State is required' },
  { name: 'postalCode', placeholder: 'Postal Code', required: 'Postal code is required' },
  { name: 'country', placeholder: 'Country', required: 'Country is required' },
];

export const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

export const center = {
  lat: 0,
  lng: 0
};
