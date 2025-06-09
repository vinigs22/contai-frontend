import { useState, useEffect } from 'react';
import { Header } from '../components/header';
import { EntrySummary } from '../components/AccountingEntries/entrySummary';
import dayjs from 'dayjs';
import type { Transaction, Summary } from '../interfaces/transaction';
import {
    Table, Select, Modal, Form, Input, DatePicker, Radio, Button, Popconfirm, Tooltip
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { api } from '../utils/api';

function formatBRLCurrencyInput(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';

    const number = (parseInt(digits) / 100).toFixed(2);
    return number
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function AccountingEntries() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<Summary>({ total: 0, credit: 0, debit: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [form] = Form.useForm();

    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<string>(currentYear);

    const columns: TableProps<Transaction>['columns'] = [
        {
            title: 'Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            align: 'center',
            width: 150,
            render: (date: string) => (
                <div>{dayjs(date).format('DD/MM/YYYY')}</div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text}>
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            render: (amount: number, record: Transaction) => {
                const colorClass = record.paymentType.toUpperCase() === 'CREDIT' ? 'text-pastelgreen' : 'text-pastelred';
                const formattedAmount = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                return <span className={colorClass}>{formattedAmount}</span>;
            },
        },
        {
            title: 'Payment Type',
            dataIndex: 'paymentType',
            key: 'paymentType',
            align: 'center'
        },
        {
            title: 'Action',
            key: 'action',
            width: 50,
            align: 'center',
            render: (_: unknown, record: Transaction) => (
                <div className="flex gap-1 items-center justify-center">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <EditOutlined style={{ color: 'black' }} />
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this transaction?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        form.setFieldsValue({
            date: dayjs(transaction.transactionDate),
            amount: formatBRLCurrencyInput(String(transaction.amount)),
            type: transaction.paymentType,
            description: transaction.description,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        api.delete(`transactions/${id}`).then(() => {
            getData();
        }).catch((error) => {
            console.error('Failed to delete transaction:', error);
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    async function getData() {
        api.get<Transaction[]>('transactions', {
            params: {
                month: selectedMonth,
                year: selectedYear,
            },
        }).then((response) => {
            setTransactions(response.data);
        }).catch((error) => {
            console.error('Failed to fetch transactions:', error);
        })

        api.get<Summary>('transactions/summary', {
            params: {
                month: selectedMonth,
                year: selectedYear,
            },
        }).then((response) => {
            setSummary(response.data);
        }).catch((error) => {
            console.error('Failed to fetch transaction summary:', error);
            setSummary({ total: 0, credit: 0, debit: 0 });
        });
    }

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                const amountInCents = parseFloat(values.amount.replace(/\./g, '').replace(',', '.')) * 100;

                const formatted: Omit<Transaction, 'id'> & { id?: string } = {
                    description: values.description,
                    amount: amountInCents,
                    paymentType: values.type,
                    transactionDate: values.date.format('YYYY-MM-DD'),
                    id: editingTransaction?.id,
                };

                if (editingTransaction) {
                    await api.put(`transactions/${editingTransaction.id}`, formatted);
                } else {
                    await api.post('transactions', formatted);
                }
                setIsModalOpen(false);
                setEditingTransaction(null);
                getData()
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    useEffect(() => {
        getData();
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        !editingTransaction && form.resetFields()
    }, [isModalOpen])

    const monthOptions = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December',
    ];

    return (
        <div className="px-8 md:px-16 h-full">
            <Header />

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
                <EntrySummary title="Total Balance" value={summary.total} color="black" />
                <EntrySummary title="Total Income" value={summary.credit} color="#5EAC5B" />
                <EntrySummary title="Total Expenses" value={summary.debit} color="#C36767" />
            </div>

            <div className="grid sm:grid-cols-[160px_160px_auto] gap-4 mt-6 mb-4">
                <Select
                    value={selectedMonth}
                    onChange={(value) => setSelectedMonth(value)}
                    placeholder="Select a month"
                    style={{ width: '100%', height: '40px' }}
                >
                    {monthOptions.map((month, index) => (
                        <Select.Option key={index} value={`${index + 1}`.padStart(2, '0')}>
                            {month}
                        </Select.Option>
                    ))}
                </Select>

                <Select
                    value={selectedYear}
                    onChange={(value) => setSelectedYear(value)}
                    placeholder="Select a year"
                    style={{ width: '100%', height: '40px' }}
                >
                    {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                        <Select.Option key={year} value={String(year)}>
                            {year}
                        </Select.Option>
                    ))}
                </Select>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="sm:justify-self-end sm:max-w-40 bg-primary text-white px-8 h-10 cursor-pointer rounded-md hover:bg-primary transition ease-in-out duration-200"
                >
                    + New Entry
                </button>
            </div>

            <Table
                dataSource={transactions}
                columns={columns}
                scroll={{ x: 'max-content' }}
                rowKey="id"
            />

            <Modal
                title={editingTransaction ? 'Edit Accounting Entry' : 'New Accounting Entry'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingTransaction ? 'Update' : 'Save'}
                cancelText="Cancel"
                okButtonProps={{
                    style: {
                        backgroundColor: '#6052E4',
                        borderColor: '#6052E4',
                    },
                }}
                cancelButtonProps={{
                    className: 'hover:!text-red-500 hover:!border-red-500',
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select a date' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Value (R$)"
                        name="amount"
                        rules={[
                            { required: true, message: 'Please enter a value' },
                            { pattern: /^\d{1,3}(\.\d{3})*(,\d{2})?$/, message: 'Please enter a valid amount (e.g., 1.000,00)' }
                        ]}
                    >
                        <Input
                            type="text"
                            placeholder="0,00"
                            inputMode="decimal"
                            pattern="\d{1,}(,\d{2})?"
                            maxLength={20}
                            onChange={(e) => {
                                const formatted = formatBRLCurrencyInput(e.target.value);
                                e.target.value = formatted;
                                form.setFieldsValue({ amount: formatted });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select a type' }]}
                    >
                        <Radio.Group>
                            <Radio value="CREDIT">Credit</Radio>
                            <Radio value="DEBIT">Debit</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
