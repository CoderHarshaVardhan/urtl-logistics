import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Search, Printer, RefreshCw } from 'lucide-react';
import { createLR, updateLR } from '../../services/lr.service';
import {
  searchConsignors, createConsignor, updateConsignor,
  searchConsignees, createConsignee, updateConsignee,
} from '../../services/party.service';
import PartyModal from './PartyModal';
import { useAuth } from '../../hooks/useAuth';

const initialItem    = { article: '', quantity: '', actualWeight: '', chargedWeight: '' };
const initialCharges = { freight: '', lrCharge: '', articleCharge: '', onlineCharge: '', doorDelivery: '', handling: '', valueSurCharge: '', gst: '' };

const chargeFields = [
  { key: 'freight',       label: 'Freight'         },
  { key: 'lrCharge',      label: 'LR charge'       },
  { key: 'articleCharge', label: 'Article charges' },
  { key: 'onlineCharge',  label: 'Online charges'  },
  { key: 'doorDelivery',  label: 'Door delivery'   },
  { key: 'handling',      label: 'Handling'        },
  { key: 'valueSurCharge',label: 'Value surcharge' },
  { key: 'gst',           label: 'GST'             },
];

/* ─── tiny helpers ─────────────────────────────────────────────────────── */
const Field = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="block text-[11px] font-medium text-gray-500 mb-1 print:mb-0">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 ' +
  'focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ' +
  'print:border-gray-400 print:py-0.5 print:h-auto';

const readonlyCls =
  'w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 ' +
  'cursor-default print:border-gray-400 print:py-0.5 print:h-auto';

/* ─── component ─────────────────────────────────────────────────────────── */
const LRForm = ({ initialData }) => {
  const { user } = useAuth();
  const isEditMode = !!initialData?._id;

  const [activeModal, setActiveModal] = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);
  const [successMsg,  setSuccessMsg]  = useState('');
  const [errorMsg,    setErrorMsg]    = useState('');

  const [formData, setFormData] = useState({
    lrNumber:      initialData?.lrNumber      || '',
    branch:        initialData?.branch        || user?.branch || '',
    date:          initialData?.date          || new Date().toISOString().split('T')[0],
    fromPlace:     initialData?.fromPlace     || '',
    toPlace:       initialData?.toPlace       || '',
    consignor:     initialData?.consignor     || null,
    consignee:     initialData?.consignee     || null,
    invoiceNo:     initialData?.invoiceNo     || '',
    ewayBillNumber:initialData?.ewayBillNumber|| '',
    payType:       initialData?.payType       || 'To Pay',
    status:        initialData?.status        || 'Dispersed',
    remarks:       initialData?.remarks       || '',
    declaredValue: initialData?.declaredValue || '',
    items:         initialData?.items?.length ? [...initialData.items] : [{ ...initialItem }],
    charges:       initialData?.charges ? { ...initialData.charges } : { ...initialCharges },
    totalAmount:   initialData?.totalAmount   || 0,
  });

  useEffect(() => {
    if (!initialData) return;
    setFormData(prev => ({
      ...prev,
      lrNumber:      initialData.lrNumber      || '',
      branch:        initialData.branch        || user?.branch || '',
      date:          initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : prev.date,
      fromPlace:     initialData.fromPlace     || '',
      toPlace:       initialData.toPlace       || '',
      consignor:     initialData.consignor     || null,
      consignee:     initialData.consignee     || null,
      invoiceNo:     initialData.invoiceNo     || '',
      ewayBillNumber:initialData.ewayBillNumber|| '',
      payType:       initialData.payType       || 'To Pay',
      status:        initialData.status        || 'Dispersed',
      remarks:       initialData.remarks       || '',
      declaredValue: initialData.declaredValue || '',
      items:         initialData.items?.length ? [...initialData.items] : [{ ...initialItem }],
      charges:       initialData.charges ? { ...initialData.charges } : { ...initialCharges },
      totalAmount:   initialData.totalAmount   || 0,
    }));
  }, [initialData, user]);

  /* auto-total */
  useEffect(() => {
    const total = Object.values(formData.charges).reduce((acc, v) => acc + Number(v || 0), 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.charges]);

  /* handlers */
  const handleInput   = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleCharge  = e => setFormData(p => ({ ...p, charges: { ...p.charges, [e.target.name]: e.target.value } }));
  const handleItem    = (i, f, v) => setFormData(p => { const it = [...p.items]; it[i][f] = v; return { ...p, items: it }; });
  const addItem       = () => setFormData(p => ({ ...p, items: [...p.items, { ...initialItem }] }));
  const removeItem    = i => formData.items.length > 1 && setFormData(p => ({ ...p, items: p.items.filter((_, j) => j !== i) }));
  const selectParty   = (type, party) => setFormData(p => ({ ...p, [type]: party }));
  const handlePartyChange = (type, field, val) => setFormData(p => ({
    ...p,
    [type]: { ...(p[type] || {}), [field]: val }
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');

    if (!formData.consignor?._id || !formData.consignee?._id) {
      setErrorMsg('Please select both Consignor and Consignee.');
      window.scrollTo(0, 0); return;
    }
    if (!formData.items[0]?.article) {
      setErrorMsg('Please add at least one valid item.'); return;
    }

    setIsLoading(true);
    try {
      // Update central party records
      if (formData.consignor?._id) {
        await updateConsignor(formData.consignor._id, {
          name: formData.consignor.name,
          mobile: formData.consignor.mobile,
          gstNo: formData.consignor.gstNo
        });
      }
      if (formData.consignee?._id) {
        await updateConsignee(formData.consignee._id, {
          name: formData.consignee.name,
          mobile: formData.consignee.mobile,
          gstNo: formData.consignee.gstNo
        });
      }

      const payload = { ...formData, consignor: formData.consignor._id, consignee: formData.consignee._id };
      if (isEditMode) {
        const res = await updateLR(initialData._id, payload);
        setSuccessMsg(`LR ${res.data?.lrNumber || formData.lrNumber} updated successfully!`);
        window.scrollTo(0, 0);
      } else {
        const res = await createLR(payload);
        setSuccessMsg(`LR ${res.lr?.lrNumber} created successfully!`);
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} LR.`);
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── section heading helper ── */
  const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-3 mb-4 print:mb-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-gray-400 whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-gray-100 print:bg-gray-300" />
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            margin: 5mm !important;
            background-color: white !important;
          }
        }
      `}</style>

      {/* ── Print Layout (Tabular, 3 Copies) ── */}
      <div className="hidden print:block w-full text-black bg-white">
        {['CONSIGNOR COPY', 'CONSIGNEE COPY', 'DRIVER COPY'].map((copyType, idx) => (
          <div key={idx} className="w-full mb-2 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
            <div className="flex justify-between items-center border-2 border-black p-1 border-b-0">
              <div className="flex items-center gap-2">
                <img src="/urtl-logo.png" alt="URTL" className="h-6 object-contain grayscale" />
                <div>
                  <h1 className="text-base font-black tracking-widest leading-none">URTL LOGISTICS</h1>
                  <p className="text-[7px] font-semibold mt-0.5">Reliable &amp; Fast Delivery Services</p>
                </div>
              </div>
              <div className="text-right text-[8px] font-semibold leading-tight">
                <p>LR No: <span className="text-xs">{formData.lrNumber || '________'}</span></p>
                <p>Date: {formData.date}</p>
                <p>Branch: {formData.branch}</p>
              </div>
            </div>

            <table className="w-full border-2 border-black text-[8px] text-left border-collapse">
              <tbody>
                <tr className="border-b-2 border-black align-top">
                  <td className="w-1/2 border-r-2 border-black p-1">
                    <p className="font-bold underline mb-0">CONSIGNOR (Sender)</p>
                    <p className="font-bold text-[9px]">{formData.consignor?.name || '______________________'}</p>
                    <p>Mobile: {formData.consignor?.mobile || '__________'}</p>
                    <p>GSTIN: {formData.consignor?.gstNo || '__________'}</p>
                  </td>
                  <td className="w-1/2 p-1">
                    <p className="font-bold underline mb-0">CONSIGNEE (Receiver)</p>
                    <p className="font-bold text-[9px]">{formData.consignee?.name || '______________________'}</p>
                    <p>Mobile: {formData.consignee?.mobile || '__________'}</p>
                    <p>GSTIN: {formData.consignee?.gstNo || '__________'}</p>
                  </td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td colSpan={2} className="p-0">
                    <table className="w-full text-center border-collapse text-[8px]">
                      <tbody>
                        <tr className="font-bold border-b border-black">
                          <td className="border-r border-black p-0.5 w-1/6">FROM</td>
                          <td className="border-r border-black p-0.5 w-1/6">TO</td>
                          <td className="border-r border-black p-0.5 w-1/6">PAY TYPE</td>
                          <td className="border-r border-black p-0.5 w-1/6">INVOICE NO</td>
                          <td className="border-r border-black p-0.5 w-1/6">E-WAY BILL</td>
                          <td className="p-0.5 w-1/6">DECL. VALUE (₹)</td>
                        </tr>
                        <tr>
                          <td className="border-r border-black p-0.5 uppercase">{formData.fromPlace || '-'}</td>
                          <td className="border-r border-black p-0.5 uppercase">{formData.toPlace || '-'}</td>
                          <td className="border-r border-black p-0.5 uppercase font-bold">{formData.payType || '-'}</td>
                          <td className="border-r border-black p-0.5 uppercase">{formData.invoiceNo || '-'}</td>
                          <td className="border-r border-black p-0.5 uppercase">{formData.ewayBillNumber || '-'}</td>
                          <td className="p-0.5 font-bold">{formData.declaredValue || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="w-1/2 border-r-2 border-black p-0">
                    <table className="w-full border-collapse text-[8px]">
                      <thead>
                        <tr className="border-b border-black">
                          <th className="p-0.5 border-r border-black text-left">ARTICLE</th>
                          <th className="p-0.5 border-r border-black text-center w-8">QTY</th>
                          <th className="p-0.5 border-r border-black text-right w-12">ACT WT</th>
                          <th className="p-0.5 text-right w-12">CHG WT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, i) => (
                          <tr key={i} className="border-b border-black last:border-0">
                            <td className="p-0.5 border-r border-black">{item.article || '-'}</td>
                            <td className="p-0.5 border-r border-black text-center">{item.quantity || '-'}</td>
                            <td className="p-0.5 border-r border-black text-right">{item.actualWeight || '-'}</td>
                            <td className="p-0.5 text-right">{item.chargedWeight || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-1 border-t border-black text-[7px]">
                      <p><span className="font-bold">Remarks:</span> {formData.remarks || 'Nil'}</p>
                    </div>
                  </td>
                  <td className="w-1/2 p-0">
                     <table className="w-full border-collapse text-[8px]">
                        <tbody>
                          {[
                            ['Freight', formData.charges.freight],
                            ['LR Charge', formData.charges.lrCharge],
                            ['Article Charge', formData.charges.articleCharge],
                            ['Online Charge', formData.charges.onlineCharge],
                            ['Door Delivery', formData.charges.doorDelivery],
                            ['Handling', formData.charges.handling],
                            ['Value Surcharge', formData.charges.valueSurCharge],
                            ['GST', formData.charges.gst],
                          ].map(([lbl, val], i) => (
                            <tr key={i} className="border-b border-black last:border-0">
                              <td className="p-0.5 border-r border-black font-semibold">{lbl}</td>
                              <td className="p-0.5 text-right font-bold w-16">{val || '0'}</td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-black bg-gray-100">
                            <td className="p-0.5 border-r border-black font-black text-[9px]">GRAND TOTAL (₹)</td>
                            <td className="p-0.5 text-right font-black text-[9px]">{formData.totalAmount.toLocaleString('en-IN')}</td>
                          </tr>
                        </tbody>
                     </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-end border-2 border-black border-t-0 p-1 pt-3 text-[8px] font-bold">
              <div className="text-center w-1/3">
                <p className="border-t border-black pt-0.5 px-3 inline-block">Receiver's Sign & Stamp</p>
              </div>
              <div className="text-center w-1/3 text-[6px] text-gray-500 uppercase tracking-widest">
                <p>Booked at Owner's Risk</p>
              </div>
              <div className="text-center w-1/3">
                <p className="border-t border-black pt-0.5 px-3 inline-block">For URTL Logistics</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Form */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden print:hidden">

      {/* ── Form header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 print:hidden">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-800">
            {isEditMode ? `Edit LR: ${formData.lrNumber}` : 'Create Lorry Receipt'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{formData.branch}</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          {formData.payType}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 print:p-0 space-y-7 print:space-y-3">

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 print:hidden">
            <p className="text-xs font-semibold mb-0.5">Error</p>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 print:hidden">
            <p className="text-xs font-semibold mb-0.5">Success</p>
            <p className="text-sm">{successMsg}</p>
          </div>
        )}

        {/* ── Section 1: Basic details ── */}
        <div>
          <SectionHeading>Basic details</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-3 print:text-xs">
            <Field label="LR Number" className="print:hidden">
              <input type="text" name="lrNumber" className={inputCls} value={formData.lrNumber} onChange={handleInput} placeholder="Generating…" />
            </Field>
            <Field label="Date *" className="print:hidden">
              <input type="date" name="date" required className={inputCls} value={formData.date} onChange={handleInput} />
            </Field>
            <Field label="From place *">
              <input type="text" name="fromPlace" required className={`${inputCls} uppercase`} value={formData.fromPlace} onChange={handleInput} />
            </Field>
            <Field label="To place *">
              <input type="text" name="toPlace" required className={`${inputCls} uppercase`} value={formData.toPlace} onChange={handleInput} />
            </Field>
          </div>
        </div>

        {/* ── Section 2: Parties ── */}
        <div>
          <SectionHeading>Parties</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:gap-3">
            {[
              { key: 'consignor', title: 'Consignor', sub: 'Sender',   tagCls: 'bg-blue-50 text-blue-700 border-blue-100' },
              { key: 'consignee', title: 'Consignee', sub: 'Receiver', tagCls: 'bg-teal-50 text-teal-700 border-teal-100' },
            ].map(({ key, title, sub, tagCls }) => (
              <div key={key} className="border border-gray-200 rounded-xl p-4 print:p-2 print:border-gray-400">
                <div className="flex items-center justify-between mb-3 print:mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-800">{title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tagCls}`}>{sub}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(key)}
                    className="print:hidden inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" strokeWidth={2} /> Select / Add
                  </button>
                </div>
                <div className="space-y-2.5 print:space-y-1">
                  <Field label="Name">
                    <input type="text" className={inputCls} value={formData[key]?.name || ''} onChange={e => handlePartyChange(key, 'name', e.target.value)} placeholder={`Select ${title.toLowerCase()}…`} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3 print:gap-2">
                    <Field label="Mobile">
                      <input type="text" className={inputCls} value={formData[key]?.mobile || ''} onChange={e => handlePartyChange(key, 'mobile', e.target.value)} />
                    </Field>
                    <Field label="GST No">
                      <input type="text" className={inputCls} value={formData[key]?.gstNo || ''} onChange={e => handlePartyChange(key, 'gstNo', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Shipment details ── */}
        <div className="pb-6 border-b border-gray-100 print:border-gray-300 print:pb-3">
          <SectionHeading>Shipment details</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 print:grid-cols-6 print:gap-3 print:text-xs">
            <Field label="Pay type">
              <select name="payType" className={inputCls} value={formData.payType} onChange={handleInput}>
                <option>To Pay</option>
                <option>Paid</option>
                <option>FOC</option>
                <option>TBB</option>
              </select>
            </Field>
            <Field label="Status">
              <select name="status" className={inputCls} value={formData.status} onChange={handleInput}>
                <option>Dispersed</option>
                <option>Delivered</option>
                <option>On the way</option>
              </select>
            </Field>
            <Field label="Invoice No">
              <input type="text" name="invoiceNo" className={inputCls} value={formData.invoiceNo} onChange={handleInput} />
            </Field>
            <Field label="E-Way Bill No">
              <input type="text" name="ewayBillNumber" className={inputCls} value={formData.ewayBillNumber} onChange={handleInput} />
            </Field>
            <Field label="Declared value (₹) *">
              <input type="number" name="declaredValue" required min="0" className={inputCls} value={formData.declaredValue} onChange={handleInput} />
            </Field>
            <Field label="Remarks">
              <input type="text" name="remarks" className={inputCls} value={formData.remarks} onChange={handleInput} />
            </Field>
          </div>
        </div>

        {/* ── Section 4: Items & Charges ── */}
        <div>
          <SectionHeading>Items &amp; charges</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-6 print:gap-4">

            {/* Items table */}
            <div className="lg:col-span-2 print:col-span-2">
              <div className="border border-gray-200 print:border-gray-400 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse table-fixed print:text-xs">
                  <thead>
                    <tr className="bg-gray-50 print:bg-gray-100">
                      {['Article name', 'Qty', 'Act. wt (kg)', 'Chg. wt (kg)', ''].map((h, i) => (
                        <th
                          key={i}
                          className={`px-3 py-2.5 print:px-1.5 print:py-1.5 border-b border-gray-200 print:border-gray-400 text-[10px] font-semibold uppercase tracking-[0.07em] text-gray-400 ${i === 4 ? 'w-10 print:hidden' : i === 0 ? '' : 'w-28 print:w-16'}`}
                        >{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 print:border-gray-300 last:border-0 hover:bg-gray-50/40">
                        <td className="px-2 py-1.5 print:px-1 print:py-0.5">
                          <input required type="text" className="w-full h-7 print:h-auto px-2 text-[12px] border border-gray-200 rounded-md print:border-transparent focus:outline-none focus:border-blue-400" value={item.article} onChange={e => handleItem(idx, 'article', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5 print:px-1 print:py-0.5">
                          <input required type="number" min="1" className="w-full h-7 print:h-auto px-2 text-[12px] text-center border border-gray-200 rounded-md print:border-transparent focus:outline-none focus:border-blue-400" value={item.quantity} onChange={e => handleItem(idx, 'quantity', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5 print:px-1 print:py-0.5">
                          <input required type="number" min="0" step="0.01" className="w-full h-7 print:h-auto px-2 text-[12px] text-right border border-gray-200 rounded-md print:border-transparent focus:outline-none focus:border-blue-400" value={item.actualWeight} onChange={e => handleItem(idx, 'actualWeight', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5 print:px-1 print:py-0.5">
                          <input required type="number" min="0" step="0.01" className="w-full h-7 print:h-auto px-2 text-[12px] text-right border border-gray-200 rounded-md print:border-transparent focus:outline-none focus:border-blue-400" value={item.chargedWeight} onChange={e => handleItem(idx, 'chargedWeight', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5 text-center print:hidden">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            disabled={formData.items.length === 1}
                            className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-25 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="print:hidden inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Plus className="w-4 h-4" strokeWidth={2} /> Add another item
              </button>
            </div>

            {/* Charges panel */}
            <div className="bg-gray-50 print:bg-white border border-gray-200 print:border-gray-400 rounded-xl print:rounded-sm p-4 print:p-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-gray-400 mb-3 print:mb-1.5 print:text-[9px]">
                Charges (₹)
              </p>
              <div className="space-y-2 print:space-y-0.5">
                {chargeFields.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <label className="text-[12px] print:text-[10px] text-gray-600 truncate">{label}</label>
                    <input
                      type="number"
                      name={key}
                      min="0"
                      step="1"
                      className="w-24 print:w-16 h-7 print:h-auto px-2 text-right text-[12px] print:text-[10px] border border-gray-200 print:border-gray-300 rounded-lg print:rounded-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                      value={formData.charges[key]}
                      onChange={handleCharge}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3.5 print:mt-2 print:pt-2 border-t border-gray-200 print:border-gray-400 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800 print:text-xs">Grand total</span>
                <span className="text-xl print:text-sm font-semibold text-blue-700 print:text-gray-900">
                  ₹{formData.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* ── Action bar ── */}
        <div className="print:hidden flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" strokeWidth={1.75} /> Print
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.75} /> Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              : <Save className="w-4 h-4" strokeWidth={2} />}
            {isLoading
              ? (isEditMode ? 'Updating…' : 'Saving…')
              : (isEditMode ? 'Update Lorry Receipt' : 'Save Lorry Receipt')}
          </button>
        </div>
      </form>

      {/* ── Modals ── */}
      <PartyModal
        isOpen={activeModal === 'consignor'}
        onClose={() => setActiveModal(null)}
        onSelect={party => selectParty('consignor', party)}
        title="Consignor"
        searchApi={searchConsignors}
        createApi={createConsignor}
      />
      <PartyModal
        isOpen={activeModal === 'consignee'}
        onClose={() => setActiveModal(null)}
        onSelect={party => selectParty('consignee', party)}
        title="Consignee"
        searchApi={searchConsignees}
        createApi={createConsignee}
      />
    </div>
    </>
  );
};

export default LRForm;