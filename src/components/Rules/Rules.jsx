import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import ReactDragListView from "react-drag-listview";
import Select from 'react-select';

import { getApiLink } from "../../services/apiService";
import { useModules } from "../../contexts/ModuleContext";

import "./Rules.scss";
import Dialog from "@mui/material/Dialog";
import AddRole from "../Roles/addRole";

let productOptions = appLocalizer.all_products || [];
productOptions = [
    {
        value: -1,
        label: "All Product"
    },
    ...productOptions
]

let categoryOptions = appLocalizer.all_product_cat || [];
categoryOptions = [
    {
        value: -1,
        label: "All Category"
    },
    ...categoryOptions
]

let userOptions = appLocalizer.all_users || [];
userOptions = [
    {
        value: -1,
        label: "All User"
    },
    ...userOptions
]

let roleOptions = appLocalizer.role_array || [];
roleOptions = [
    {
        value: -1,
        label: "All Role"
    },
    ...roleOptions
]

/**
 * Render upper filter section
 * @returns 
 */
const FilterSection = (props) => {
    const { onChange } = props;

    // State variable for store input fields
    const [inputFields, setInputFields] = useState({});

    const [applicableFor, setApplicableFor] = useState("product");
    const [appliTo, setAppliTo] = useState("user");

    const settingChange = useRef(false);

    // Trigger onchange event when inputfields changes
    useEffect(() => {
        onChange(inputFields);
    }, [inputFields]);

    // Handle changing on inputs
    const hanleOnchange = (name, value) => {
        setInputFields((inputFields) => {
            return { ...inputFields, [name]: value };
        });
    }

    // Handle applicable for change
    const handleApplicableForChange = (value) => {
        setApplicableFor(value);

        setInputFields((inputFields) => {
            const newInputFields = { ...inputFields, category_id: -1, product_id: -1 };
            if (value == 'product') {
                delete newInputFields['category_id'];
            } else {
                delete newInputFields['product_id'];
            }
            return newInputFields;
        });
    }

    // Handle appli to change
    const handleAppliToChange = (value) => {
        setAppliTo(value);

        setInputFields((inputFields) => {
            const newInputFields = { ...inputFields, role_id: -1, user_id: -1 };
            if (value == 'user') {
                delete newInputFields['role_id'];
            } else {
                delete newInputFields['user_id'];
            }
            return newInputFields;
        });
    }

    return (
        <section className="rule-filter-container">
            {/* filter by product or category */}
            <main className="filter-wrapper">
                <article>
                    <p>Filter Rules by</p>
                    <div className='toggle-setting-container'>
                        <ul>
                            <li onClick={(e) => handleApplicableForChange(e.target.value)}>
                                <input class="toggle-setting-form-input" type="radio" id='product' name="product" value='product' checked={applicableFor === 'product' ? true : false } />
                                <label htmlFor='product'>Product</label>
                            </li>
                            <li onClick={(e) => handleApplicableForChange(e.target.value)}>
                                <input class="toggle-setting-form-input" type="radio" id='category' checked={applicableFor === 'category' ? true : false } name="category" value='category' />
                                <label htmlFor='category'>Category</label>
                            </li>
                        </ul>
                    </div>
                </article>
                {
                    applicableFor == 'product' &&
                    <div className='dynamic-select-wrapper'>
                        <Select
                            onChange={(changedValue) => hanleOnchange('product_id', changedValue.value)}
                            options={productOptions}
                            value={productOptions.find((opt) => opt.value == inputFields['product_id'])}
                            defaultValue={{ value: '', label: 'All product' }}
                        />
                    </div>
                }

                {/* Category select section */}
                {
                    applicableFor == 'category' &&
                    <div className='dynamic-select-wrapper'>
                        <Select
                            onChange={(changedValue) => hanleOnchange('category_id', changedValue.value)}
                            options={categoryOptions}
                            value={categoryOptions.find((opt) => opt.value == inputFields['category_id'])}
                            defaultValue={{ value: '', label: 'All category' }}
                        />
                    </div>
                }
            </main>
            <main className="filter-wrapper">
                <article>
                    <p>Filter Rules by</p>
                    <div className='toggle-setting-container'>
                        {/* filter by user or role */}
                        <ul>
                            <li onClick={(e) => handleAppliToChange(e.target.value)}>
                                <input class="toggle-setting-form-input" type="radio" id='user' name="user" value='user' checked={appliTo === 'user' ? true : false } />
                                <label htmlFor='user'>User</label>
                            </li>
                            <li onClick={(e) => handleAppliToChange(e.target.value)}>
                                <input class="toggle-setting-form-input" type="radio" id='role' checked={appliTo === 'role' ? true : false } name="role" value='role' />
                                <label htmlFor='role'>Role</label>
                            </li>
                        </ul>
                    </div>
                </article>
                {/* Product select section */}
                {
                    appliTo == 'user' &&
                    <div className='dynamic-select-wrapper'>
                        <Select
                            onChange={(changedValue) => hanleOnchange('user_id', changedValue.value)}
                            options={userOptions}
                            value={userOptions.find((opt) => opt.value == inputFields['user_id'])}
                            defaultValue={{ value: '', label: 'All user' }}
                        />
                    </div>
                }

                {/* Category select section */}
                {
                    appliTo == 'role' &&
                    <div className='dynamic-select-wrapper'>
                        <Select
                            onChange={(changedValue) => hanleOnchange('role_id', changedValue.value)}
                            options={roleOptions}
                            value={roleOptions.find((opt) => opt.value == inputFields['role_id'])}
                            defaultValue={{ value: '', label: 'All role' }}
                        />
                    </div>
                }
            </main>            
        </section>
    );
}

/**
 * Add or update new rule section
 * @param {*} props 
 * @returns 
 */
const AddUpdateRuleSection = (props) => {
    const { rule, onSubmit, onClose, editMode, deleteModal, setDeleteModal } = props;

    // State variable for store input fields
    const [inputFields, setInputFields] = useState(rule || { 'product_id': -1, 'user_id': -1, 'type': 'fixed' });

    const [applicableFor, setApplicableFor] = useState(rule?.category_id ? 'category' : 'product');
    const [appliTo, setAppliTo] = useState(rule?.role_id ? 'role' : 'user');

    // Handle applicable for change
    const handleApplicableForChange = (value) => {
        setApplicableFor(value);

        setInputFields((inputFields) => {
            const newInputFields = { ...inputFields, category_id: -1, product_id: -1 };
            if (value == 'product') {
                delete newInputFields['category_id'];
            } else {
                delete newInputFields['product_id'];
            }
            return newInputFields;
        });
    }

    // Handle appli to change
    const handleAppliToChange = (value) => {
        setAppliTo(value);

        setInputFields((inputFields) => {
            const newInputFields = { ...inputFields, role_id: -1, user_id: -1 };
            if (value == 'user') {
                delete newInputFields['role_id'];
            } else {
                delete newInputFields['user_id'];
            }
            return newInputFields;
        });
    }

    // Handle changing on inputs
    const hanleOnchange = (name, value) => {
        setInputFields((inputFields) => {
            return { ...inputFields, [name]: value };
        });
    }

    // Verify before submit
    const verifyBeforeSubmit = () => {
        if (!inputFields['type']) {
            return {
                status: false,
                error: "Discount type is missing",
            }
        }
        if (!inputFields['quentity']) {
            return {
                status: false,
                error: "Product quentity is missing",
            }
        }
        if (!inputFields['amount']) {
            return {
                status: false,
                error: "Amount is missing",
            }
        }

        return {
            status: true,
        };
    }

    // Handle submit event
    const handleSubmit = (event) => {
        // Verifi the form field
        const verify = verifyBeforeSubmit();
        if (verify.status === false) {
            window.alert(verify.error);
            return;
        }

        onSubmit?.(inputFields);
    }

    const [openDialog, setOpenDialog] = useState(false);

    const handleAddRole = () => {
        setOpenDialog(true);
    }


    return (
        <>
            {
                <Dialog
                    className="admin-roles-popup"
                    open={openDialog}
                    onClose={() => {
                        setOpenDialog(false);
                    }}
                    aria-labelledby="form-dialog-title"
                >
                    <AddRole
                        setOpenDialog={setOpenDialog}
                    />
                </Dialog>
            }
            <main className="add-new-rule-popup-container">
                <section className="popup-main-wrapper">
                    <nav className="popup-navigation">
                        <p>{editMode ? 'Edit rule' : 'Add new rule'}</p>
                        <div
                            className="add-update-rule-close"
                            onClick={(e) => { onClose?.() }}
                        >
                            Close
                        </div>
                    </nav>
                    {/* Product Category Section */}
                    <div className="product-category-section">
                        {/* Name input section */}
                        <div className="section-items">
                            <label className="section-items-label">Name</label>
                            <input
                                type="text"
                                value={inputFields['name']}
                                onChange={(e) => hanleOnchange('name', e.target.value)}
                            />
                        </div>

                        {/* Product Category select section */}
                        <div className="section-items">
                            <label className="section-items-label">Applicable For</label>
                            <div className="radio-tabs">
                                <input
                                    type="radio"
                                    id="radio-product"
                                    value="product"
                                    checked={applicableFor === 'product'}
                                    onChange={(e) => handleApplicableForChange(e.target.value)}
                                />
                                <label className="tab" htmlFor="radio-product">
                                    <span>Product</span>
                                </label>

                                <input
                                    type="radio"
                                    id="radio-category"
                                    value="category"
                                    checked={applicableFor === 'category'}
                                    onChange={(e) => handleApplicableForChange(e.target.value)}
                                />
                                <label className="tab" htmlFor="radio-category">
                                    <span>Category</span>
                                </label>

                                <span className="glider"></span>
                            </div>
                        </div>

                        <div className="section-items">
                            <label className="section-items-label">Applied on</label>
                            {/* Product select section */}
                            <div className="select-drop-down-wrapper">
                                {
                                    applicableFor == 'product' &&
                                    <Select
                                        onChange={(changedValue) => hanleOnchange('product_id', changedValue.value)}
                                        options={productOptions}
                                        value={productOptions.find((opt) => opt.value == inputFields['product_id'])}
                                        defaultValue={{ value: '', label: 'All product' }}
                                    />
                                }

                                {/* Category select section */}
                                {
                                    applicableFor == 'category' &&
                                    <Select
                                        onChange={(changedValue) => hanleOnchange('category_id', changedValue.value)}
                                        options={categoryOptions}
                                        value={categoryOptions.find((opt) => opt.value == inputFields['category_id'])}
                                        defaultValue={{ value: '', label: 'All category' }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    {/* User Role Section */}
                    <div className="user-role-section">
                        <div className="section-items">
                            <label className="section-items-label">For Who</label>
                            <div className="radio-tabs">
                                <input
                                    type="radio"
                                    id="radio-user"
                                    value="user"
                                    checked={appliTo === 'user'}
                                    onChange={(e) => handleAppliToChange(e.target.value)}
                                />
                                <label className="tab" htmlFor="radio-user">
                                    <span>User</span>
                                </label>

                                <input
                                    type="radio"
                                    id="radio-role"
                                    value="role"
                                    checked={appliTo === 'role'}
                                    onChange={(e) => handleAppliToChange(e.target.value)}
                                />
                                <label className="tab" htmlFor="radio-role">
                                    <span>Role</span>
                                </label>

                                <span className="glider"></span>
                            </div>
                        </div>

                        <div className="section-items">
                            <label className="section-items-label">Name</label>
                            {/* Product select section */}
                            <div className="select-drop-down-wrapper">
                                {
                                    appliTo == 'user' &&
                                    <Select
                                        onChange={(changedValue) => hanleOnchange('user_id', changedValue.value)}
                                        options={userOptions}
                                        value={userOptions.find((opt) => opt.value == inputFields['user_id'])}
                                        defaultValue={{ value: '', label: 'All user' }}
                                    />
                                }

                                {/* Category select section */}
                                {
                                    appliTo == 'role' &&
                                    <Select

                                        onChange={(changedValue) => hanleOnchange('role_id', changedValue.value)}
                                        options={roleOptions}
                                        value={roleOptions.find((opt) => opt.value == inputFields['role_id'])}
                                        defaultValue={{ value: '', label: 'All role' }}
                                    />
                                }
                            </div>
                        </div>
                        {
                            appliTo == 'role' &&
                            <button onClick={handleAddRole}>
                                Add Role
                            </button>
                        }
                    </div>

                    <div className="discount-type section-items">
                        <label className="section-items-label">Discount</label>
                        <div className="discount-type-content">
                            <input
                                type="number"
                                value={inputFields['amount']}
                                onChange={(e) => hanleOnchange('amount', e.target.value)}
                            />
                            <select
                                value={inputFields['type']}
                                onChange={(e) => hanleOnchange('type', e.target.value)}
                            >
                                <option value="fixed"><span>Fixed</span></option>
                                <option value="percentage"><span>Percentage</span></option>
                            </select>
                        </div>
                    </div>

                    <div className="product-quantity section-items">
                        <label className="section-items-label">Product Quantity</label>
                        <input
                            type="number"
                            value={inputFields['quentity']}
                            onChange={(e) => hanleOnchange('quentity', e.target.value)}
                        />
                    </div>

                    <section className="popup-footer-btn">
                        {editMode &&
                            <>
                                <div
                                    className="rule-status"
                                    onChange={(e) => hanleOnchange('active', e.target.checked)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={!(inputFields['active'] === "0" || inputFields['active'] === false)}
                                        onChange={(e) => hanleOnchange('active', e.target.checked)}
                                    />
                                    {(!(inputFields['active'] === "0" || inputFields['active'] === false)) ? 'Deactive' : 'Active'}
                                </div>
                                <div className="edit-popup-btn delete-btn" onClick={() => { setDeleteModal(true) }}>
                                    Delete
                                </div>
                            </>
                        }
                        <div className="submit-add-new-rule-btn edit-popup-btn" onClick={(e) => { handleSubmit(e) }}>{editMode ? 'Update' : 'Add and Activate'}</div>
                    </section>
                </section>
            </main>
        </>
    );
}

/**
 * Display single rule
 * @param {*} props 
 * @returns 
 */
const Rule = (props) => {
    const { item, onChange, onDelete } = props;

    const [editRuleOpened, setEditRuleOpened] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);

    // Get applied on message
    const getAppliedOnMessage = () => {
        const product_id = item.product_id;
        const category_id = item.category_id;

        if (!product_id && !category_id) {
            return (
                <p> All Product </p>
            );
        }

        return (
            <>
                {
                    product_id &&
                    <p>Product: {productOptions.find((opt) => opt.value == product_id)?.label}</p>
                }
                {
                    category_id &&
                    <p>Category: {categoryOptions.find((opt) => opt.value == category_id)?.label}</p>
                }
            </>
        );
    }

    // Get applied to message
    const getAppliedToMessage = () => {
        const user_id = item.user_id;
        const role_id = item.role_id;

        if (!user_id && !role_id) {
            return (
                <p> All User </p>
            );
        }

        return (
            <>
                {
                    user_id &&
                    <p>User: {userOptions.find((opt) => opt.value == user_id)?.label}</p>
                }
                {
                    role_id &&
                    <p>Role: {roleOptions.find((opt) => opt.value == role_id)?.label}</p>
                }
            </>
        );
    }

    //Get pricing message
    const getRuleMessage = () => {
        return (
            <p> {item.amount} {item.type == 'fixed' ? appLocalizer.currency : 'Percent'} for min {item.quentity} Qty </p>
        );
    }

    const DeleteModal = () => {
        return (
            <div id="deleteModal">
                <div className="modal-confirm">
                    <div className="modal-header">
                        <div className="icon">X</div>
                        <h1>Are you sure?</h1>
                    </div>
                    <div className="modal-body">
                        <p>
                            Do you really want to delete these records? This process cannot be
                            undone.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <div
                            onClick={(e) => { setDeleteModal(false) }}
                            className=""
                        >
                            Cancel
                        </div>
                        <div onClick={(e) => onDelete()} className="btn-secondary">
                            Delete
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Function that handle table expand.

    const handleTableExpand = (e) => {
        e.children[0].classList.toggle('font-arrow-down');
        e.children[0].classList.toggle('font-arrow-right');
        const row = e.parentElement.parentElement;
        row.classList.toggle("active");
    }

    return (
        <div className="single-rule-container">
            <div className="single-rule-cell rule-name">
                {item.name || "---"}
            </div>
            <div className="single-rule-cell rule-appliedon">
                {getAppliedOnMessage()}
            </div>
            <div className="single-rule-cell rule-appliedto">
                {getAppliedToMessage()}
            </div>
            <div className="single-rule-cell rule-pricing">
                <h1>Rule</h1>
                {getRuleMessage()}
            </div>
            <div className="single-rule-cell rule-action">
                <h1>Status</h1>
                {
                    (item.active === "0" || item.active === false) ?
                        <span className="suspende">Suspended</span>
                        :
                        <span className="active">Active</span>
                }
            </div>
            <div className="single-rule-cell rule-action">
                <h1>Action</h1>
                <article>
                    <div className="edit" onClick={(e) => setEditRuleOpened(true)}>🐽</div>
                    <div className="delete" onClick={(e) => setDeleteModal(true)}>☠️</div>
                </article>
            </div>
            <div className="expand-btn">
                <button onClick={(e) => handleTableExpand(e.currentTarget)}>
                    <i class="admin-font font-arrow-right"></i>
                </button>
            </div>

            {
                deleteModal &&
                <DeleteModal />
            }

            {
                editRuleOpened &&
                <AddUpdateRuleSection
                    rule={item}
                    onClose={() => { setEditRuleOpened(false) }}
                    onSubmit={(updatedRule) => {
                        setEditRuleOpened(false);
                        onChange(updatedRule);
                    }}
                    editMode
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                />
            }
        </div >
    );
}

/**
 * Render rule page
 * @returns 
 */
const Rules = () => {

    // Check pro is active and module is active or not.
    const { modules } = useModules();
    if ( ! modules.includes( 'rules' ) || ! appLocalizer.pro_active ) {
        return (
            <div> Pro required || Activate module </div>
        ); 
    }

    // State variable declearation
    const [rulesList, setRuleList] = useState(null);
    const [addRuleOpend, setAddRuleOpend] = useState(false);

    // Load the rules
    const fetchRules = async () => {
        axios.post(getApiLink('get-rules'), {})
            .then(response => {
                setRuleList(response.data || []);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Set the rules in loading of page
    useEffect(() => {
        fetchRules();
    }, []);

    // Handle new rule submit
    const handleAddRule = async (rule) => {
        setRuleList(null);
        axios.post(getApiLink('add-rule'), { rule: rule })
            .then(response => {
                fetchRules();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Handle update existing rule
    const handleUpdateRule = (id, updatedRule) => {
        setRuleList(null);

        axios.post(getApiLink('update-rule'), { id, rule: updatedRule })
            .then(response => {
                fetchRules();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Handle delete a particular rule
    const handleDelete = (id) => {
        setRuleList(null);

        axios.post(getApiLink('delete-rule'), { id })
            .then(response => {
                fetchRules();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Handle priority
    const onChangePriority = (startIndex, endIndex) => {
        let ruleSlice = [];

        // get the slice 
        if (startIndex < endIndex) {
            ruleSlice = rulesList.slice(startIndex, endIndex + 1);
        } else {
            ruleSlice = rulesList.slice(endIndex, startIndex + 1);
        }

        // Get the id list and priority list
        const idList = ruleSlice.map(({ id }) => id);
        const priorityList = ruleSlice.map(({ priority }) => priority);

        if (startIndex < endIndex) {
            priorityList.unshift(priorityList.pop());
        } else {
            priorityList.push(priorityList.shift());
        }

        const idPriorityMap = {};

        idList.forEach((id, index) => {
            idPriorityMap[id] = priorityList[index];
        })

        return idPriorityMap;
    }

    // Handle functions
    const onDragEnd = (startIndex, endIndex) => {
        // Handle priority change
        setRuleList(null);

        const idPriorityMap = onChangePriority(startIndex, endIndex);

        axios.post(getApiLink('update-priority'), { id_priority_map: idPriorityMap })
            .then(response => {
                fetchRules();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            <main className="catalog-rules-main-container">
                <section className="admin-page-title">
                    <p className="title">Rules</p>
                    <div className="add-new-rule-btn">
                        <div className="button-new-rule" onClick={(e) => setAddRuleOpend(true)}>Add New Rule</div>
                        {
                            addRuleOpend &&
                            <AddUpdateRuleSection
                                onSubmit={(rule) => {
                                    setAddRuleOpend(false);
                                    handleAddRule(rule);
                                }}
                                onClose={() => setAddRuleOpend(false)}
                            />
                        }
                    </div>
                </section>

                <div className="rule-section-main-wrapper">
                    <FilterSection onChange={() => { }} />

                    {/* Render drag and drop */}
                    {
                        rulesList &&
                        <div className="draggable-rule-container">
                            <section className="rules-table-heading-wrapper">
                                <div>Name</div>
                                <div>Applicable For</div>
                                <div>For Whom</div>
                                {/* <div>Rule</div> */}
                                <div>Rule</div>
                                <div>Status</div>
                                <div>Action</div>
                            </section>
                            <ReactDragListView
                                nodeSelector=".draggable-rule"
                                lineClassName="dragLine"
                                onDragEnd={(fromIndex, toIndex) => onDragEnd(fromIndex, toIndex)}
                            >
                                {
                                    rulesList.map((item, index) => (
                                        <div className="draggable-rule">
                                            <Rule
                                                item={item}
                                                onChange={(updatedRule) => { handleUpdateRule(item.id, updatedRule) }}
                                                onDelete={() => { handleDelete(item.id) }}
                                            />
                                        </div>
                                    ))}
                            </ReactDragListView>
                        </div>
                    }
                    {
                        !rulesList &&
                        <div>Loading</div>
                    }
                </div>

            </main>
        </>
    );
}

export default Rules;