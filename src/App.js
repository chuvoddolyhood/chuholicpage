@page "/listpage/{tableId}"
@using System.Text
@using System.Text.Json
@using YourApp.Shared.Models
@using YourApp.Client.Pages
@inject HttpClient Http
@inject IJSRuntime JS

<PageTitle>Dynamic List Page</PageTitle>

@if (!isInitialized)
{
    <p>Loading...</p>
}
else
{
    <div class="mb-3">
        <DynamicComponent Type="searchType" Parameters="conditionParams" />
    </div>

    <div>
        <DynamicComponent Type="gridType" Parameters="gridParams" />
    </div>
}

@code {
    [Parameter] public string? tableId { get; set; }

    private Type? searchType;
    private Type? gridType;
    private object? currentConfig;
    private Type? dtoType;
    private string? apiUrl;

    private Dictionary<string, object>? conditionParams;
    private Dictionary<string, object>? gridParams;

    private bool isInitialized = false;
    private bool isSearchDisabled = true;
    private bool isDownloadDisabled = true;

    private LaunchParameters sessionParams = new();
    private IEnumerable<object> currentData = new List<object>();

    // ============================================================
    // 1️⃣  PageMap - định nghĩa tất cả các trang động
    // ============================================================
    private static readonly Dictionary<string, PageConfig> PageMap = new()
    {
        ["101"] = new PageConfig
        {
            SearchType = typeof(CustomerSearch),
            GridType = typeof(GenericGrid<MCustomerDto>),
            ApiUrl = "api/Inquiry/GetCustomer",
            DtoType = typeof(MCustomerDto),
            Config = new CustomerGridConfig()
        },
        ["201"] = new PageConfig
        {
            SearchType = typeof(ProductSearch),
            GridType = typeof(GenericGrid<MProductDto>),
            ApiUrl = "api/Inquiry/GetProduct",
            DtoType = typeof(MProductDto),
            Config = new ProductGridConfig()
        },
        ["301"] = new PageConfig
        {
            SearchType = typeof(CompanySearch),
            GridType = typeof(GenericGrid<MCompanyDto>),
            ApiUrl = "api/Inquiry/GetCompany",
            DtoType = typeof(MCompanyDto),
            Config = new CompanyGridConfig()
        }
    };

    // ============================================================
    // 2️⃣  Khi tham số (tableId) thay đổi
    // ============================================================
    protected override async Task OnParametersSetAsync()
    {
        if (!string.IsNullOrEmpty(tableId) && PageMap.TryGetValue(tableId, out var pageConfig))
        {
            searchType = pageConfig.SearchType;
            gridType = pageConfig.GridType;
            currentConfig = pageConfig.Config;
            apiUrl = pageConfig.ApiUrl;
            dtoType = pageConfig.DtoType;
        }

        BuildConditionParams();
        BuildGridParams();

        isInitialized = true;
        await InvokeAsync(StateHasChanged);
    }

    // ============================================================
    // 3️⃣  Khi người dùng nhập input ở Search component
    // ============================================================
    private async Task OnInputChanged(object model)
    {
        isSearchDisabled = false;
        isDownloadDisabled = true;
        BuildConditionParams();
        await InvokeAsync(StateHasChanged);
    }

    // ============================================================
    // 4️⃣  Khi người dùng nhấn Search
    // ============================================================
    private async Task OnSearch(SearchCondition model)
    {
        isSearchDisabled = true;
        isDownloadDisabled = true;
        BuildConditionParams();
        await InvokeAsync(StateHasChanged);

        if (string.IsNullOrEmpty(apiUrl)) return;

        try
        {
            var jsonContent = JsonSerializer.Serialize(model);
            var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await Http.PostAsync(apiUrl, httpContent);

            if (response.IsSuccessStatusCode)
            {
                var resultType = typeof(ProcessResponse<>).MakeGenericType(dtoType!);
                var result = await response.Content.ReadFromJsonAsync(resultType);

                currentData = ((dynamic)result)?.Data?.ToList<object>() ?? new List<object>();

                if (currentData.Any())
                    isDownloadDisabled = false;
            }
            else
            {
                await JS.InvokeVoidAsync("alert", $"API call failed: {response.StatusCode}");
                currentData = new List<object>();
            }
        }
        catch (Exception ex)
        {
            await JS.InvokeVoidAsync("alert", $"Lỗi khi tải dữ liệu: {ex.Message}");
            currentData = new List<object>();
        }

        BuildConditionParams();
        BuildGridParams();
        await InvokeAsync(StateHasChanged);
    }

    // ============================================================
    // 5️⃣  Khi người dùng nhấn Download
    // ============================================================
    private async Task OnDownload(object model)
    {
        if (!currentData.Any())
        {
            await JS.InvokeVoidAsync("alert", "Không có dữ liệu để tải xuống.");
            return;
        }

        await JS.InvokeVoidAsync("alert", "Bắt đầu tải dữ liệu...");
        // TODO: Gọi API export nếu cần
    }

    // ============================================================
    // 6️⃣  Tạo conditionParams truyền xuống DynamicComponent Search
    // ============================================================
    private void BuildConditionParams()
    {
        conditionParams = new()
        {
            ["OnSearch"] = EventCallback.Factory.Create<SearchCondition>(this, OnSearch),
            ["OnInputChanged"] = EventCallback.Factory.Create<object>(this, OnInputChanged),
            ["OnDownload"] = EventCallback.Factory.Create<object>(this, OnDownload),
            ["sessionParams"] = sessionParams,
            ["isSearchDisabled"] = isSearchDisabled,
            ["isDownloadDisabled"] = isDownloadDisabled
        };
    }

    // ============================================================
    // 7️⃣  Tạo gridParams truyền xuống DynamicComponent Grid
    // ============================================================
    private void BuildGridParams()
    {
        gridParams = new()
        {
            ["DataSource"] = currentData,
            ["Config"] = currentConfig
        };
    }
}





@using YourApp.Shared.Models

<Container MaxWidth="fluid">
    <Grid Container="true" Spacing="2">
        <Grid Item="true" xs="12" sm="4">
            <label class="form-label">Customer Code</label>
            <InputText @bind-Value="CustomerCode"
                       @onchange="InputChanged"
                       @onkeydown="HandleEnterKey"
                       tabindex="1"
                       class="form-control"
                       placeholder="Enter customer code" />
        </Grid>

        <Grid Item="true" xs="12" sm="4">
            <label class="form-label">Customer Name</label>
            <InputText @bind-Value="CustomerName"
                       @onchange="InputChanged"
                       @onkeydown="HandleEnterKey"
                       tabindex="2"
                       class="form-control"
                       placeholder="Enter customer name" />
        </Grid>

        <Grid Item="true" xs="12" sm="4">
            <label class="form-label">Customer Name (EN)</label>
            <InputText @bind-Value="CustomerNameEn"
                       @onchange="InputChanged"
                       @onkeydown="HandleEnterKey"
                       tabindex="3"
                       class="form-control"
                       placeholder="Enter English name" />
        </Grid>

        <Grid Item="true" xs="12" class="mt-3">
            <button class="btn btn-primary me-2"
                    @onclick="Search"
                    tabindex="4"
                    disabled="@isSearchDisabled">
                🔍 Search
            </button>

            <button class="btn btn-secondary"
                    @onclick="Download"
                    tabindex="5"
                    disabled="@isDownloadDisabled">
                ⬇️ Download
            </button>
        </Grid>
    </Grid>
</Container>

@code {
    [Parameter] public EventCallback<SearchCondition> OnSearch { get; set; }
    [Parameter] public EventCallback<object> OnInputChanged { get; set; }
    [Parameter] public EventCallback<object> OnDownload { get; set; }
    [Parameter] public LaunchParameters? sessionParams { get; set; }

    [Parameter] public bool isSearchDisabled { get; set; }
    [Parameter] public bool isDownloadDisabled { get; set; }

    private string? CustomerCode;
    private string? CustomerName;
    private string? CustomerNameEn;

    private SearchCondition model = new();

    private async Task InputChanged(ChangeEventArgs e)
    {
        model.CustomerCode = CustomerCode;
        model.CustomerName = CustomerName;
        model.CustomerNameEn = CustomerNameEn;

        await OnInputChanged.InvokeAsync(model);
    }

    private async Task Search()
    {
        model.CustomerCode = CustomerCode;
        model.CustomerName = CustomerName;
        model.CustomerNameEn = CustomerNameEn;

        await OnSearch.InvokeAsync(model);
    }

    private async Task Download()
    {
        await OnDownload.InvokeAsync(model);
    }

    private async Task HandleEnterKey(KeyboardEventArgs e)
    {
        if (e.Key == "Enter" && !isSearchDisabled)
        {
            await Search();
        }
    }

    protected override void OnParametersSet()
    {
        if (sessionParams != null)
        {
            // ví dụ gán giá trị mặc định
        }
    }
}

m
@inherits InputBase<DateTime?>

<input type="text"
       class="@CssClass"
       value="@CurrentValueAsString"
       placeholder="@Placeholder"
       @onchange="OnChange"
       @onblur="OnBlur"
       @oninput="OnInput" />

@code {
    [Parameter] public string Placeholder { get; set; } = "YYYY-MM-DD";

    // Format hiển thị mặc định (có thể đổi sang "dd/MM/yyyy" nếu muốn)
    private const string DateFormat = "yyyy-MM-dd";

    protected override string FormatValueAsString(DateTime? value)
        => value.HasValue ? value.Value.ToString(DateFormat) : string.Empty;

    private void OnInput(ChangeEventArgs e)
    {
        // Gọi cập nhật tạm để hiện input ngay khi gõ
        CurrentValueAsString = e.Value?.ToString() ?? string.Empty;
    }

    private void OnChange(ChangeEventArgs e)
    {
        if (DateTime.TryParseExact(
            e.Value?.ToString(),
            DateFormat,
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None,
            out var parsed))
        {
            CurrentValue = parsed;
        }
        else
        {
            // Nếu nhập sai format, tạo thông báo lỗi validation
            var fieldIdentifier = FieldIdentifier.Create(ValueExpression);
            EditContext?.NotifyFieldChanged(fieldIdentifier);
            EditContext?.AddValidationMessage(fieldIdentifier,
                $"Vui lòng nhập đúng định dạng {DateFormat}");
        }
    }

    private void OnBlur(FocusEventArgs e)
    {
        // Nếu bạn muốn xử lý gì thêm khi mất focus thì có thể thêm vào đây
    }

    // Áp dụng class giống InputDate (tự động đổi khi invalid)
    protected override string CssClass =>
        new CssBuilder("form-control")
            .AddClass("is-invalid", EditContext?.GetValidationMessages(FieldIdentifier).Any() == true)
            .AddClass(Class, !string.IsNullOrEmpty(Class))
            .ToString();
}









