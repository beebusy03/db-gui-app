import {
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
import {
  Search,
  Database,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
  Sparkles,
  ShoppingCart,
  Warehouse,
  Box,
  Smartphone,
} from "lucide-react";

import "./ProductDashboard.css";

const manufacturerNames: { [key: string]: string } = {
  A: "Bernhardt",
  B: "Ashley",
  C: "Coaster",
  D: "Luonto",
  E: "BH",
  F: "Shopify Carts",
  G: "Massiano Inventory",
  H: "Universal Products",
};

const tableMap: { [key: string]: string } = {
  A: "bernhardt_products",
  B: "ashley_products",
  C: "coaster_products",
  D: "luonto_products",
  E: "bh_products",
  F: "shopify_carts",
  G: "massiano_inventory",
  H: "universal_newproducts_modified",
};

const manufacturerColumns: { [key: string]: { key: string; label: string }[] } = {
  A: [
    { key: "id", label: "ID" },
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "msrp", label: "MSRP" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status" },
    { key: "quantity", label: "Qty" },
    { key: "next_availability_date", label: "Next Available" },
    { key: "last_updated", label: "Updated" },
  ],
  B: [
    { key: "product_name", label: "Name" },
    { key: "product_sku", label: "SKU" },
    { key: "product_status", label: "Status" },
    { key: "inventory_qtyvalue", label: "Qty" },
    { key: "last_updated", label: "Updated" },
  ],
  C: [
    { key: "product_sku", label: "SKU" },
    { key: "product_status", label: "Status" },
    { key: "inventory_qtyvalue", label: "Qty" },
    { key: "last_updated", label: "Updated" },
  ],
  D: [
    { key: "id", label: "ID" },
    { key: "productname", label: "Name" },
    { key: "productsku", label: "SKU" },
    { key: "availability", label: "Availability" },
    { key: "last_updated", label: "Updated" },
  ],
  E: [
    { key: "id", label: "ID" },
    { key: "vendor_sku", label: "Vendor SKU" },
    { key: "description", label: "Description" },
    { key: "quantity", label: "Qty" },
    { key: "last_updated", label: "Updated" },
  ],
  F: [
    { key: "id", label: "ID" },
    { key: "store_domain", label: "Store" },
    { key: "cart_token", label: "Cart Token" },
    { key: "product_id", label: "Product ID" },
    { key: "sku", label: "SKU" },
    { key: "product_title", label: "Title" },
    { key: "vendor", label: "Vendor" },
    { key: "amount", label: "Amount" },
    { key: "quantity", label: "Qty" },
    { key: "received_at", label: "Received At" },
  ],
  G: [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product Name" },
    { key: "po_number", label: "PO Number" },
    { key: "received_qty", label: "Received Qty" },
    { key: "pending_qty", label: "Pending Qty" },
    { key: "total_qty", label: "Total Qty" },
    { key: "weight_per_unit", label: "Weight/Unit" },
    { key: "cube_per_unit", label: "Cube/Unit" },
    { key: "fulfilled_cube", label: "Fulfilled Cube" },
    { key: "vendor", label: "Vendor" },
    { key: "status", label: "Status" },
    { key: "last_updated", label: "Updated" },
  ],
  H: [
    { key: "id", label: "ID" },
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "quantity", label: "Quantity" },
    { key: "retail_price", label: "Retail Price" },
    { key: "your_price", label: "Your Price" },
    { key: "availability_date", label: "Availability Date" },
    { key: "last_updated", label: "Updated" },
  ],
};

const PAGE_SIZE = 20;

export default function ProductDashboard() {
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const searchDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchRef = useRef("");

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedManufacturer) return;

    setLoading(true);
    try {
      const table = tableMap[selectedManufacturer];
      const url = `https://k6yilzfl19.execute-api.us-east-1.amazonaws.com/products?table=${table}&page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const json = await res.json();

      const data = json?.data?.[table]?.data || [];
      const count = json?.data?.[table]?.count || 0;

      setProducts(data);
      setTotalCount(count);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedManufacturer, currentPage, searchQuery]);

  useEffect(() => {
    if (!selectedManufacturer) return;

    if (searchDelayRef.current) clearTimeout(searchDelayRef.current);

    searchDelayRef.current = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      if (searchDelayRef.current) clearTimeout(searchDelayRef.current);
    };
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedRows([]);
  }, [selectedManufacturer]);

  useEffect(() => {
    const isNewSearch = searchQuery !== lastSearchRef.current;

    if (isNewSearch) {
      setCurrentPage(1);
      setExpandedRows([]);
      lastSearchRef.current = searchQuery;
    }
  }, [searchQuery]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getManufacturerIcon = (manufacturerKey: string) => {
    switch (manufacturerKey) {
      case "F":
        return <ShoppingCart size={16} />;
      case "G":
        return <Warehouse size={16} />;
      case "H":
        return <Box size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getCardTitle = (manufacturerKey: string) => {
    switch (manufacturerKey) {
      case "F":
        return "Shopify Cart Products";
      case "G":
        return "Massiano Inventory";
      case "H":
        return "Universal Products";
      default:
        return `${manufacturerNames[manufacturerKey]} Products`;
    }
  };

  const formatCellValue = (value: any, key: string) => {
    if (value === null || value === undefined) return "-";
    
    if (['msrp', 'price', 'amount', 'retail_price', 'your_price'].includes(key) && value) {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    
    if (['quantity', 'received_qty', 'pending_qty', 'total_qty', 'weight_per_unit', 'cube_per_unit', 'fulfilled_cube'].includes(key) && value) {
      return parseFloat(value).toLocaleString();
    }
    
    if (key.includes('date') || key.includes('updated') || key === 'received_at') {
      return new Date(value).toLocaleDateString();
    }
    
    return value;
  };

  // Mobile Card View Component
  const ProductCard = ({ product, index }: { product: any; index: number }) => {
    const isExpanded = expandedRows.includes(index);
    const columns = manufacturerColumns[selectedManufacturer];
    
    const keyColumns = columns.slice(0, 3);
    const detailColumns = columns.slice(3);
    
    return (
      <div className="mobile-product-card">
        <div className="mobile-card-header">
          <div className="mobile-card-main-info">
            {keyColumns.map((col) => (
              <div key={col.key} className="mobile-card-field">
                <span className="mobile-field-label">{col.label}:</span>
                <span className="mobile-field-value">
                  {formatCellValue(product[col.key], col.key)}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => toggleRow(index)}
            className="mobile-expand-button"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="mobile-card-details">
            {detailColumns.map((col) => (
              <div key={col.key} className="mobile-card-field">
                <span className="mobile-field-label">{col.label}:</span>
                <span className="mobile-field-value">
                  {formatCellValue(product[col.key], col.key)}
                </span>
              </div>
            ))}
            <div className="mobile-json-section">
              <details>
                <summary className="mobile-json-summary">View Raw JSON Data</summary>
                <pre className="mobile-json-content">
                  {JSON.stringify(product, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`dashboard-container ${isMobile ? 'mobile' : 'desktop'}`} style={{
        margin: 0,
        padding: isMobile ? '1rem' : '2rem',
        width: '100%',
        position: 'relative',
        left: 0,
        top: 0
      }}>
      <div className="dashboard-header-container">
        <div className="sparkle-wrapper">
          <Sparkles className="sparkle sparkle-1" />
          <Sparkles className="sparkle sparkle-2" />
          <Sparkles className="sparkle sparkle-3" />
        </div>
        <div className="dashboard-header">
          <div className="header-glow"></div>
          <div className="header-icon-wrapper">
            <Database className="header-icon" />
            <div className="icon-pulse"></div>
          </div>
          <div className="header-content">
            <h1 className="header-title">Database Product Dashboard</h1>
            {isMobile && (
              <div className="mobile-badge">
                <Smartphone size={14} />
                Mobile View
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="gradient-border-wrapper">
        <div className="card-inner glass-effect">
          <div className="card-header">
            <div className="filter-title">
              <Search className="filter-icon" />
              Filters
            </div>
          </div>
          <div className={`card-content ${isMobile ? 'mobile-filters' : ''}`}>
            <div className="filter-item">
              <label>Manufacturer</label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="select-trigger"
              >
                <option value="">Select a manufacturer</option>
                {Object.entries(manufacturerNames).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                disabled={!selectedManufacturer}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table or Cards */}
      {selectedManufacturer && (
        <div className="gradient-border-wrapper">
          <div className="card-inner glass-effect">
            <div className="card-header">
              <div className="card-title-container">
                {getManufacturerIcon(selectedManufacturer)}
                {getCardTitle(selectedManufacturer)}
                <span className="product-count">({totalCount} products)</span>
              </div>
            </div>
            <div className="card-content">
              {loading ? (
                <div className="loading-container">
                  <Loader2 className="animate-spin" />
                  Loading...
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">No products found.</div>
              ) : !isMobile ? (
                // Desktop Table View
                <>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {manufacturerColumns[selectedManufacturer].map((col) => (
                            <th key={col.key}>{col.label}</th>
                          ))}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((row, i) => (
                          <Fragment key={i}>
                            <tr>
                              {manufacturerColumns[selectedManufacturer].map((col) => (
                                <td key={col.key}>
                                  {formatCellValue(row[col.key], col.key)}
                                </td>
                              ))}
                              <td>
                                <button 
                                  onClick={() => toggleRow(i)}
                                  className="expand-button"
                                >
                                  {expandedRows.includes(i) ? (
                                    <>
                                      <ChevronUp size={16} /> Hide
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown size={16} /> Expand
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                            {expandedRows.includes(i) && (
                              <tr>
                                <td colSpan={manufacturerColumns[selectedManufacturer].length + 1}>
                                  <pre className="json-content">
                                    {JSON.stringify(row, null, 2)}
                                  </pre>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="pagination-container">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {Math.ceil(totalCount / PAGE_SIZE)}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          p < Math.ceil(totalCount / PAGE_SIZE) ? p + 1 : p
                        )
                      }
                      disabled={currentPage >= Math.ceil(totalCount / PAGE_SIZE)}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                // Mobile Card View
                <>
                  <div className="mobile-products-container">
                    {products.map((product, index) => (
                      <ProductCard 
                        key={index} 
                        product={product} 
                        index={index} 
                      />
                    ))}
                  </div>

                  {/* Mobile Pagination */}
                  <div className="pagination-container mobile-pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      ← Prev
                    </button>
                    <span className="pagination-info">
                      {currentPage} / {Math.ceil(totalCount / PAGE_SIZE)}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          p < Math.ceil(totalCount / PAGE_SIZE) ? p + 1 : p
                        )
                      }
                      disabled={currentPage >= Math.ceil(totalCount / PAGE_SIZE)}
                      className="pagination-button"
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}