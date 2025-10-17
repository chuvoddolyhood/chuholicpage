function App() {
  return (
    <>
      <p>hello friend</p>
    </>
  );
}@page "/list/{tableName}"
@inject NavigationManager Nav

<h3>@tableName List</h3>

@if (searchType != null)
{
    <DynamicComponent Type="@searchType"
                      Parameters="@searchParams" />
}

@if (gridType != null)
{
    <DynamicComponent Type="@gridType"
                      Parameters="@gridParams" />
}

@code {
    [Parameter] public string? tableName { get; set; }

    private Type? searchType;
    private Type? gridType;
    private Dictionary<string, object>? searchParams;
    private Dictionary<string, object>? gridParams;

    private object? searchCondition;

    protected override void OnParametersSet()
    {
        switch (tableName?.ToLower())
        {
            case "customer":
                searchType = typeof(CustomerSearch);
                gridType = typeof(GenericGrid<Customer>);
                break;
            case "company":
                searchType = typeof(CompanySearch);
                gridType = typeof(GenericGrid<Company>);
                break;
            case "product":
                searchType = typeof(ProductSearch);
                gridType = typeof(GenericGrid<Product>);
                break;
        }

        // Cấu hình parameter cho search
        searchParams = new()
        {
            ["OnSearch"] = EventCallback.Factory.Create<object?>(this, OnSearch)
        };

        // Cấu hình parameter cho grid
        gridParams = new()
        {
            ["LoadData"] = (Func<object?, Task<IEnumerable<object>>>)LoadDataAsync
        };
    }

    // Callback khi người dùng bấm “Tìm kiếm”
    private void OnSearch(object? condition)
    {
        searchCondition = condition;
        StateHasChanged();
    }

    // Hàm load dữ liệu theo điều kiện (dùng chung)
    private Task<IEnumerable<object>> LoadDataAsync(object? condition)
    {
        IEnumerable<object> result = [];

        switch (tableName?.ToLower())
        {
            case "customer":
                result = LoadCustomers(condition);
                break;
            case "company":
                result = LoadCompanies(condition);
                break;
            case "product":
                result = LoadProducts(condition);
                break;
        }

        return Task.FromResult(result);
    }

    // Giả dữ liệu cho từng loại
    private IEnumerable<Customer> LoadCustomers(object? cond)
    {
        var all = new List<Customer>
        {
            new() { Id = 1, Name = "Alice", Email = "a@ex.com" },
            new() { Id = 2, Name = "Bob", Email = "b@ex.com" },
            new() { Id = 3, Name = "Charlie", Email = "c@ex.com" }
        };

        if (cond is CustomerSearchCondition c)
        {
            if (!string.IsNullOrWhiteSpace(c.Name))
                all = all.Where(x => x.Name.Contains(c.Name, StringComparison.OrdinalIgnoreCase)).ToList();
            if (!string.IsNullOrWhiteSpace(c.Email))
                all = all.Where(x => x.Email.Contains(c.Email, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return all;
    }

    private IEnumerable<Company> LoadCompanies(object? _) => new[]
    {
        new Company { Id = 1, Name = "Apple", Country = "USA" },
        new Company { Id = 2, Name = "Samsung", Country = "Korea" }
    };

    private IEnumerable<Product> LoadProducts(object? _) => new[]
    {
        new Product { Id = 1, Name = "Book", Price = 10 },
        new Product { Id = 2, Name = "Pen", Price = 5 }
    };

    // Model ví dụ
    public record Customer { public int Id { get; set; } public string Name { get; set; } = ""; public string Email { get; set; } = ""; }
    public record Company { public int Id { get; set; } public string Name { get; set; } = ""; public string Country { get; set; } = ""; }
    public record Product { public int Id { get; set; } public string Name { get; set; } = ""; public decimal Price { get; set; } }
}

export default App;
