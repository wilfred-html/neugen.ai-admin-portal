import React, { useState, useMemo } from 'react';
import { AirtableRecord, FinanceCalculation } from '../../types';
import { TrashIcon } from '../../components/icons/Icons';

interface FinanceViewProps {
    calculations: AirtableRecord<FinanceCalculation>[];
    onAddCalculation: (calculation: FinanceCalculation) => Promise<void>;
    onDeleteCalculation: (recordId: string) => Promise<void>;
}

const formatCurrency = (amount: number) => `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FinanceView: React.FC<FinanceViewProps> = ({ calculations, onAddCalculation, onDeleteCalculation }) => {
    const [formState, setFormState] = useState({
        carPrice: '',
        downPayment: '',
        tradeInValue: '',
        interestRate: '',
        termMonths: '72',
    });

    const [results, setResults] = useState<FinanceCalculation | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const carPrice = parseFloat(formState.carPrice) || 0;
        const downPayment = parseFloat(formState.downPayment) || 0;
        const tradeInValue = parseFloat(formState.tradeInValue) || 0;
        const interestRate = parseFloat(formState.interestRate) || 0;
        const termMonths = parseInt(formState.termMonths) || 0;

        if (carPrice <= 0 || interestRate <= 0 || termMonths <= 0) {
            alert("Please fill in all required fields correctly.");
            return;
        }

        const loanAmount = carPrice - downPayment - tradeInValue;
        const monthlyRate = interestRate / 100 / 12;
        const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
        const totalCost = monthlyPayment * termMonths + downPayment + tradeInValue;
        const totalInterest = totalCost - carPrice;

        const newCalculation: FinanceCalculation = {
            'Car price': carPrice,
            'Down Payment': downPayment,
            'Trade in value': tradeInValue,
            'Interest Rate': interestRate,
            'Term Months': termMonths,
            'Monthly Payments': monthlyPayment,
            'Total Cost': totalCost,
            'Total Interest': totalInterest,
        };
        
        setResults(newCalculation);
        await onAddCalculation(newCalculation);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Deal Calculator</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Form Inputs */}
                        <div>
                            <label className="block text-sm font-medium text-text-light-minor mb-1">Car Price (R)</label>
                            <input type="number" name="carPrice" value={formState.carPrice} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-minor mb-1">Down Payment (R)</label>
                            <input type="number" name="downPayment" value={formState.downPayment} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-minor mb-1">Trade-in Value (R)</label>
                            <input type="number" name="tradeInValue" value={formState.tradeInValue} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-minor mb-1">Interest Rate (%)</label>
                            <input type="number" name="interestRate" step="0.1" value={formState.interestRate} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-minor mb-1">Loan Term (Months)</label>
                            <select name="termMonths" value={formState.termMonths} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="24">24 months</option>
                                <option value="36">36 months</option>
                                <option value="48">48 months</option>
                                <option value="60">60 months</option>
                                <option value="72">72 months</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-primary text-text-on-primary py-2.5 px-4 rounded-lg hover:bg-secondary">Calculate & Save</button>
                    </form>
                </div>
                <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Calculation Results</h3>
                    {results ? (
                        <div className="space-y-4">
                             <div className="bg-primary/10 p-4 rounded-lg">
                                <div className="text-sm text-primary">Monthly Payment</div>
                                <div className="text-3xl font-bold text-text-light-major">{formatCurrency(results['Monthly Payments']!)}</div>
                            </div>
                            <div className="bg-green-500/10 p-4 rounded-lg">
                                <div className="text-sm text-green-400">Total Cost of Credit</div>
                                <div className="text-2xl font-bold text-text-light-major">{formatCurrency(results['Total Cost']!)}</div>
                            </div>
                             <div className="bg-orange-500/10 p-4 rounded-lg">
                                <div className="text-sm text-orange-400">Total Interest Paid</div>
                                <div className="text-2xl font-bold text-text-light-major">{formatCurrency(results['Total Interest']!)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-text-light-minor py-8 h-full flex items-center justify-center">Enter details and click Calculate to see results.</div>
                    )}
                </div>
            </div>
            <div className="bg-card-dark rounded-xl border border-border-dark shadow-sm">
                <div className="p-6 border-b border-border-dark">
                    <h3 className="text-lg font-semibold text-text-light-major">Previous Calculations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                         <thead className="bg-brand-dark">
                            <tr>
                                {['Car Price', 'Down Payment', 'Interest', 'Term', 'Monthly Payment', 'Total Cost', 'Actions'].map(h => 
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-light-minor uppercase tracking-wider">{h}</th>)}
                            </tr>
                        </thead>
                         <tbody className="bg-card-dark divide-y divide-border-dark">
                            {calculations.map(record => (
                                <tr key={record.id} className="hover:bg-bg-dark">
                                    <td className="px-6 py-4">{formatCurrency(record.fields['Car price'] || 0)}</td>
                                    <td className="px-6 py-4">{formatCurrency(record.fields['Down Payment'] || 0)}</td>
                                    <td className="px-6 py-4">{record.fields['Interest Rate'] || 0}%</td>
                                    <td className="px-6 py-4">{record.fields['Term Months'] || 0} mos</td>
                                    <td className="px-6 py-4 font-medium text-primary">{formatCurrency(record.fields['Monthly Payments'] || 0)}</td>
                                    <td className="px-6 py-4 font-medium text-green-400">{formatCurrency(record.fields['Total Cost'] || 0)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onDeleteCalculation(record.id)} className="p-2 text-text-light-minor hover:text-red-400 hover:bg-red-400/10 rounded-full" title="Delete Calculation">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceView;