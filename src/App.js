@using Microsoft.AspNetCore.Components
@using Microsoft.AspNetCore.Components.Forms
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

    // Format hiển thị mặc định
    private const string DateFormat = "yyyy-MM-dd";

    // Format ra string để hiển thị trong input
    protected override string FormatValueAsString(DateTime? value)
        => value.HasValue ? value.Value.ToString(DateFormat) : string.Empty;

    // Phải override ParseValueFromString (InputBase bắt buộc)
    protected override bool TryParseValueFromString(
        string value, out DateTime? result, out string validationErrorMessage)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            result = null;
            validationErrorMessage = null;
            return true;
        }

        if (DateTime.TryParseExact(value, DateFormat,
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, out var parsed))
        {
            result = parsed;
            validationErrorMessage = null;
            return true;
        }

        result = null;
        validationErrorMessage = $"Vui lòng nhập đúng định dạng {DateFormat}";
        return false;
    }

    private void OnInput(ChangeEventArgs e)
    {
        CurrentValueAsString = e.Value?.ToString() ?? string.Empty;
    }

    private void OnChange(ChangeEventArgs e)
    {
        CurrentValueAsString = e.Value?.ToString() ?? string.Empty;
    }

    private void OnBlur(FocusEventArgs e)
    {
        // xử lý thêm nếu cần
    }

    // CSS giống InputDate (form-control + is-invalid)
    protected string CssClass =>
        $"{(AdditionalAttributes != null && AdditionalAttributes.TryGetValue("class", out var cls) ? cls : "form-control")}" +
        $"{(EditContext?.GetValidationMessages(FieldIdentifier).Any() == true ? " is-invalid" : string.Empty)}";
}