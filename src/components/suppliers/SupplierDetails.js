import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import EditableDetails from "../utils/EditableDetails";
import { updateSupplier } from "../../store/actions/supplierActions";
import moment from "moment";

class SupplierDetails extends React.Component {
  state = {
    edit: false,
    name: this.props.supplier?.name,
    city: this.props.supplier?.city,
    description: this.props.supplier?.description,
    address: this.props.supplier?.address,
    contact: this.props.supplier?.contact,
    email: this.props.supplier?.email,
    zip: this.props.supplier?.zip,
    phoneNumber: this.props.supplier?.phoneNumber,
    state: this.props.supplier?.state,
    nickName: this.props.supplier?.nickName,
  };

  updateSupplier() {
    const { supplierId } = this.props;

    if (this.state.edit)
      this.props.updateSupplier(supplierId, { ...this.state });
    this.setState((prev) => ({ edit: !prev.edit }));
  }

  render() {
    const { auth, supplier } = this.props;

    const items = [
      {
        key: "name",
        value: this.state.name,
        label: "Name",
      },
      {
        key: "city",
        value: this.state.city,
        label: "City",
      },
      {
        key: "description",
        value: this.state.description,
        label: "Description",
      },
      {
        key: "address",
        value: this.state.address,
        label: "Address",
      },
      {
        key: "contact",
        value: this.state.contact,
        label: "Contact",
      },
      {
        key: "email",
        value: this.state.email,
        label: "Email",
      },
      {
        key: "phoneNumber",
        value: this.state.phoneNumber,
        label: "Phone number",
      },
      {
        key: "zip",
        value: this.state.zip,
        label: "Zip",
      },
      {
        key: "state",
        value: this.state.state,
        label: "State",
      },
      {
        key: "nickName",
        value: this.state.nickName,
        label: "Nickname",
      },
    ];

    if (!auth.uid) return <Redirect to="/signin" />;

    if (supplier) {
      return (
        <div className="container section project-details">
          <div className="card z-depth-0">
            <EditableDetails
              items={items}
              setState={this.setState.bind(this)}
              action={this.updateSupplier.bind(this)}
              edit={this.state.edit}
              renderExtra={() => (
                <div> {moment(supplier.dateCreated.toDate()).calendar()}</div>
              )}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading supplier...</p>
        </div>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSupplier: (supplierId, supplier) =>
      dispatch(updateSupplier(supplierId, supplier)),
  };
};
const mapStateToProps = (state, ownProps) => {
  //console.log(state);

  // Todo: We should get just the specific supplier from firestore instead of all of the supplier and then filtering it out here
  const id = ownProps.match.params.id;
  const suppliers = state.firestore.data.suppliers;
  const supplier = suppliers ? suppliers[id] : null;
  console.log("supplier: ", supplier);
  return {
    supplier: supplier,
    supplierId: id,
    auth: state.firebase.auth,
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "suppliers" }])
)(SupplierDetails);
