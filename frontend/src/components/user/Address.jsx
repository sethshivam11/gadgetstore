import React, { useCallback, useEffect, useState } from "react";
import "../../style/user/cart.css";
import "../../style/user/address.css";

const Address = (props) => {
  const { address, token, host, toast, setProgress, setDelivery, width } = props;
  const [addNew, setAddNew] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editAddress, setEditAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternate: "",
    type: "",
  });
  const fetchAddress = useCallback(() => {
    setProgress(30);
    fetch(`${host}/api/user/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          setProgress(70);
          setSavedAddresses(resData.user.address);
        } else {
          console.log(resData.error);
        }
        setProgress(100);
      });
  }, [host, token, setProgress, setSavedAddresses]);
  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);
  const getAddress = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        )
          .then((res) => res.json())
          .then((resData) => {
            toast.success("Location set");
            let district = resData.localityInfo.administrative[2].name;
            if (district.includes) {
              district = resData.localityInfo.administrative[2].name.slice(
                0,
                -9
              );
            }
            setNewAddress({
              name: newAddress.name,
              mobile: newAddress.mobile,
              pincode: newAddress.pincode,
              address: newAddress.address,
              city: district,
              alternate: newAddress.alternate,
              type: newAddress.type,
              locality: resData.locality,
              state: resData.principalSubdivision,
            });
          });
      });
    } else {
      toast.error("Allow to use your location");
    }
  };
  const handleNewAddress = (e) => {
    e.preventDefault();
    fetch(`${host}/api/user/address/${editAddress ? "edit": "add"}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
      body: JSON.stringify({
        name: newAddress.name,
        mobile: newAddress.mobile,
        pincode: newAddress.pincode,
        locality: newAddress.locality,
        address: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        landmark: newAddress.landmark,
        alternate: newAddress.alternate,
        type: newAddress.type,
      }),
    }).then(res => res.json()).then(resData => {
      if(resData.success){
        setAddNew(false);
        setEditAddress(false);
        let addId = resData.user.address.length + 1;
        let newAdd = newAddress;
        newAdd.id = `address-${addId}`;
        if(!editAddress){
          setSavedAddresses(savedAddresses.concat([newAdd]));
        }
        toast.success("Address saved");
      }
      else if (resData.error === "Internal Server Error!" || resData.error.type) {
        toast.error("Something went wrong, Please try again later!");
      }
    })
  };
  const handleNewChange = (e) => {
    if (e.target.name === "mobile" && e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
    if (e.target.name === "alternate" && e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
    if (e.target.name === "pincode" && e.target.value.length > 6) {
      e.target.value = e.target.value.slice(0, 6);
    }
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };
  const deleteAddress = (id) => {
    fetch(`${host}/api/user/address/remove`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast.success("Address Deleted");
          setSavedAddresses(
            savedAddresses.filter((address) => address.id !== id)
          );
        } else if (
          resData.error === "Internal Server Error!" ||
          resData.error === "Please provide a valid address" ||
          resData.error === "Address does not exists"
        ) {
          toast.error("Something went wrong, Please try again later!");
        }
      });
  };
  return (
    <div
      className="cart-top"
      style={{ display: `${address ? "block" : "none"}`, width: width }}
    >
      <div className="options">
        <h1 className="address-head">Delivery Address</h1>
      </div>
      <div className="cart-bottom">
        <h3 className="saved-address-head">Saved Addresses</h3>
        {savedAddresses.length > 0 ? (
          savedAddresses.map((address) => {
            return (
              <div
                className="address-saved-glimpse"
                key={address.id}
                htmlFor={`${address.id}`}
              >
                <p className="mb-10">
                  <input
                    type="radio"
                    name="address"
                    id={`${address.id}`}
                    value={savedAddresses[0]}
                    onChange={() => {
                      setDelivery(address);
                      setAddNew(false);
                    }}
                    disabled={addNew || editAddress}
                  />
                  &nbsp;&nbsp;
                  <label
                    htmlFor={`${address.id}`}
                    className="address-select-label"
                  >
                    <span className="savedaddress-name">{address.name}&nbsp;</span>
                    <span className="savedaddress-type">{address.type}&nbsp;</span>
                    <span className="savedaddress-mobile">
                      {address.mobile}
                    </span>
                  </label>
                  <button
                    className="address-float-right address-float-delete"
                    onClick={() => deleteAddress(address.id)}
                    style={{
                      visibility: `${
                        editAddress || addNew ? "hidden" : "visible"
                      }`,
                    }}
                  >
                    DELETE
                  </button>
                  <button
                    className="address-float-right"
                    onClick={() => {
                      setNewAddress(address);
                      setAddNew(true);
                      setEditAddress(true);
                    }}
                    style={{
                      visibility: `${
                        editAddress || addNew ? "hidden" : "visible"
                      }`,
                    }}
                  >
                    EDIT
                  </button>
                </p>
                <p className="address-full-para">
                  <label
                    htmlFor={`${address.id}`}
                    className="address-select-label address-label-full"
                  >
                    <span className="address-full">
                      {address.address}, {address.locality}, {address.city},{" "}
                      {address.state} - {address.pincode}
                    </span>
                  </label>
                </p>
              </div>
            );
          })
        ) : (
          <div className="no-saved-addresses">No Saved Addresses</div>
        )}
        <div className="address-saved-glimpse">
          <form
            onSubmit={handleNewAddress}
            className="address-tab"
            style={{ display: `${addNew ? "block" : "none"}` }}
          >
            <button className="address-auto-locate" onClick={getAddress}>
              <i className="fa-solid fa-location-crosshairs"></i> Use my current
              location
            </button>
            <div className="form-item-small">
              <label htmlFor="address-name" className="address-label">
                Name
              </label>
              <input
                autoComplete="name"
                type="text"
                className="address-input"
                id="address-name"
                name="name"
                value={newAddress.name}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-small">
              <label htmlFor="address-mobile" className="address-label">
                Mobile
              </label>
              <input
                autoComplete="tel-national"
                type="number"
                id="address-mobile"
                className="address-input"
                name="mobile"
                maxLength={10}
                value={newAddress.mobile}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-small">
              <label htmlFor="address-pincode" className="address-label">
                Pincode
              </label>
              <input
                autoComplete="postal-code"
                type="number"
                id="address-pincode"
                className="address-input"
                name="pincode"
                maxLength={6}
                value={newAddress.pincode}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-small">
              <label htmlFor="address-locality" className="address-label">
                Locality
              </label>
              <input
                autoComplete="address-line1"
                type="text"
                className="address-input"
                id="address-locality"
                name="locality"
                value={newAddress.locality ?? ""}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-large">
              <label htmlFor="address-address" className="address-label">
                Address
              </label>
              <textarea
                autoComplete="off"
                type="text"
                id="address-address"
                className="address-input address-textarea"
                name="address"
                value={newAddress.address}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-small">
              <label htmlFor="address-city" className="address-label">
                City
              </label>
              <input
                autoComplete="address-level1"
                type="text"
                className="address-input"
                id="address-city"
                name="city"
                value={newAddress.city ?? ""}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-small">
              <label htmlFor="address-state" className="address-label">
                State
              </label>
              <select
                type="text"
                id="address-state"
                className="address-input"
                name="state"
                onChange={handleNewChange}
                autoComplete="address-level3"
                value={
                  newAddress.state
                    ? `${newAddress.state ?? ""}`
                    : "Select State"
                }
              >
                <option value="Select State" disabled>
                  Select State
                </option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman & Diu">
                  Dadra and Nagar Haveli and Daman & Diu
                </option>
                <option value="The Government of NCT of Delhi">
                  The Government of NCT of Delhi
                </option>
                <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
            </div>
            <div className="form-item-small">
              <label htmlFor="address-landmark" className="address-label">
                Landmark
              </label>
              <input
                autoComplete="off"
                type="text"
                id="address-landmark"
                name="landmark"
                className="address-input"
                value={newAddress.landmark ?? ""}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item-small">
              <label htmlFor="address-alternate" className="address-label">
                Alternate Mobile
              </label>
              <input
                autoComplete="tel-local"
                type="number"
                id="address-alternate"
                name="alternate"
                className="address-input"
                maxLength={10}
                value={newAddress.alternate}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-item">
              <span className="address-type-home address-label">
                Address Type
              </span>
              <input
                autoComplete="off"
                type="radio"
                id="address-type-home"
                name="type"
                value={"Home"}
                className="address-input-radio"
                onChange={handleNewChange}
              />
              <label
                htmlFor="address-type-home"
                className="address-label-radio"
              >
                Home (All day delivery)
              </label>
              <input
                type="radio"
                id="address-type-office"
                name="type"
                autoComplete="off"
                className="address-input-radio"
                value={"Office"}
                onChange={handleNewChange}
              />
              <label
                htmlFor="address-type-office"
                className="address-label-radio"
              >
                Work (Delivery between 10AM - 5PM)
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setNewAddress({
                  name: "",
                  mobile: "",
                  pincode: "",
                  street: "",
                  locality: "",
                  address: "",
                  city: "",
                  state: "",
                  landmark: "",
                  alternate: "",
                  type: "",
                });
                setAddNew(false);
                setEditAddress(false);
              }}
              className="newAddress-btn newAddress-bordered"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                newAddress.name.length <= 0 ||
                newAddress.mobile.length < 10 ||
                newAddress.pincode.length < 6 ||
                newAddress.address.length <= 0 ||
                newAddress.locality.length <= 0 ||
                newAddress.city.length <= 0 ||
                newAddress.state.length <= 0 ||
                newAddress.type.length <= 0
              }
              className="newAddress-btn"
            >
              Save
            </button>
          </form>
          <button
            style={{
              all: "unset",
              width: "100%",
              display: `${!addNew ? "block" : "none"}`,
              cursor: "pointer",
            }}
            onClick={() => setAddNew(true)}
          >
            <span
              style={{
                fontSize: "30px",
                margin: "0 10px",
                verticalAlign: "bottom",
              }}
            >
              +
            </span>
            <span
              style={{
                paddingBottom: "5px",
                display: "inline-block",
                verticalAlign: "super",
              }}
            >
              &nbsp;Add a new address
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;
